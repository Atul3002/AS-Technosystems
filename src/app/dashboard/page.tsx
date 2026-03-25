
'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Bot, 
  CloudCog, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle2,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const subscription = profile?.subscription;
  const status = subscription?.status || 'none';
  const expiresAt = subscription?.expiresAt;

  // Countdown logic
  useEffect(() => {
    if (status !== 'active' || !expiresAt) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const distance = expiry - now;

      if (distance < 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        // Trigger auto-expire update if not already handled
        if (profileRef) {
          updateDocumentNonBlocking(profileRef, {
            'subscription.status': 'expired',
            updatedAt: new Date().toISOString()
          });
        }
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, expiresAt, profileRef]);

  // Effect to check and handle subscription expiration (backup logic)
  useEffect(() => {
    if (status === 'active' && expiresAt && profileRef) {
      const expiryDate = new Date(expiresAt).getTime();
      const now = Date.now();

      if (now > expiryDate) {
        updateDocumentNonBlocking(profileRef, {
          'subscription.status': 'expired',
          updatedAt: new Date().toISOString()
        });
      }
    }
  }, [status, expiresAt, profileRef]);

  const activeServices = [
    { title: 'Cloud Monitoring', status: 'Active', icon: CloudCog, color: 'text-blue-500' },
    { title: 'Process Automation', status: 'Disabled', icon: Bot, color: 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
            <Zap className={cn("h-4 w-4", status === 'active' ? "text-primary" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold uppercase">
              {status === 'active' ? (subscription?.planId || 'Standard') : status === 'expired' ? 'Expired' : 'Free'}
            </div>
            <div className="flex flex-col gap-1 mt-1">
              {status === 'active' ? (
                <>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <p className="text-[10px] text-muted-foreground font-medium">ACTIVE</p>
                  </div>
                  {timeLeft && (
                    <div className="flex items-center gap-1 text-primary">
                      <Timer className="h-3 w-3" />
                      <p className="text-[10px] font-bold">{timeLeft} remaining</p>
                    </div>
                  )}
                </>
              ) : status === 'expired' ? (
                <div className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  <p className="text-[10px] font-bold uppercase">Plan ended</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Limited features</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No active requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Services */}
        <Card>
          <CardHeader>
            <CardTitle>Your Services</CardTitle>
            <CardDescription>Monitor your active digitalization tools.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeServices.map((service) => (
                <div key={service.title} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <service.icon className={cn("h-5 w-5", service.color)} />
                    <span className="font-medium">{service.title}</span>
                  </div>
                  <span className={cn(
                    "rounded-full px-2 py-1 text-[10px] font-bold uppercase",
                    service.status === 'Active' ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  )}>
                    {service.status}
                  </span>
                </div>
              ))}
              <Button asChild variant="ghost" className="w-full mt-2">
                <Link href="/dashboard/subscription">View all services</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Call to Action */}
        <Card className={cn("text-primary-foreground border-none", status === 'active' ? "bg-accent" : "bg-primary")}>
          <CardHeader>
            <CardTitle>{status === 'active' ? "Manage Your Success" : "Unlock Full Potential"}</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {status === 'active' 
                ? "Explore advanced features included in your current subscription tier." 
                : "Upgrade to a premium plan to access advanced AI automation and IoT insights."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/dashboard/subscription">
                {status === 'active' ? "Manage Subscription" : "View Premium Plans"} <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
