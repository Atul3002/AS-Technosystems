'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useAuth, useFirestore, useDoc } from '@/firebase';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  User as UserIcon,
  CreditCard,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch subscription to handle sidebar visibility
  const subscriptionRef = user ? doc(db, 'subscriptions', user.uid) : null;
  const { data: subscription, isLoading: isSubscriptionLoading } = useDoc(subscriptionRef);

  // Auth redirect: Ensure only logged in users can see this area
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isSubscribed = subscription?.isActive && new Date() < new Date(subscription?.endTime);

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, requiresSub: true },
    { label: 'Subscription', href: '/dashboard/subscription', icon: CreditCard, requiresSub: false },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform md:translate-x-0">
        <div className="flex h-full flex-col px-3 py-4">
          <Link href="/" className="mb-10 flex items-center gap-2 px-3">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Digital Hub</span>
          </Link>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isDisabled = item.requiresSub && !isSubscribed;
              if (isDisabled) return null; // Don't show Overview if not subscribed

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t pt-4">
            <div className="mb-4 flex items-center gap-3 px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                {isSubscribed ? <UserIcon className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5 text-destructive" />}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-medium text-foreground">{user.email}</p>
                <p className="text-[10px] text-muted-foreground">
                  {isSubscribed ? 'Active Subscriber' : 'Inactive Account'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:ml-64">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              Welcome back to your A S Technosystems workspace.
            </p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
