'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap, Clock, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessingExpiration, setIsProcessingExpiration] = useState(false);

  const subscriptionRef = user ? doc(db, 'subscriptions', user.uid) : null;
  const { data: subscription, isLoading: isSubscriptionLoading } = useDoc(subscriptionRef);

  useEffect(() => {
    if (isUserLoading || isSubscriptionLoading || !user || isProcessingExpiration) {
      return;
    }

    const checkSubscription = async () => {
      const now = new Date();
      
      // Case 1: No subscription document found
      if (!subscription) {
        router.push('/dashboard/subscription');
        return;
      }

      const endTime = new Date(subscription.endTime);

      // Case 2: Subscription exists but is either marked inactive OR the current time has passed the end time
      if (!subscription.isActive || now > endTime) {
        setIsProcessingExpiration(true);

        // If it was still marked active in DB but actually expired, update Firestore
        if (subscription.isActive && now > endTime) {
          try {
            if (subscriptionRef) {
              await updateDoc(subscriptionRef, { isActive: false });
            }
          } catch (error) {
            console.error('Error updating subscription status:', error);
          }
        }

        // Show alert and redirect
        toast({
          variant: 'destructive',
          title: 'Subscription Expired',
          description: 'Your subscription has expired. Please renew to continue.',
        });
        router.push('/dashboard/subscription');
      }
    };

    checkSubscription();
  }, [user, subscription, isUserLoading, isSubscriptionLoading, router, toast, subscriptionRef, isProcessingExpiration]);

  // Handle loading states
  if (isUserLoading || isSubscriptionLoading || isProcessingExpiration) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Final safety check: If logic above hasn't redirected yet but sub is invalid, don't render content
  const isValidSub = subscription && subscription.isActive && new Date() < new Date(subscription.endTime);
  if (!isValidSub) {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary uppercase">Active</div>
            <p className="text-xs text-muted-foreground">Full access granted</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Amount</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{subscription.amount}</div>
            <p className="text-xs text-muted-foreground">Standard pricing</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expires At</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {new Date(subscription.endTime).toLocaleTimeString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(subscription.endTime).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Welcome to your Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/80">
            Your subscription is currently active. You have full access to all features and services provided by A S Technosystems Digital Hub.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h4 className="font-semibold mb-2">Active Services</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time Analytics</li>
                <li>• Automation Workflows</li>
                <li>• Smart IoT Integration</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <h4 className="font-semibold mb-2">Account Summary</h4>
              <p className="text-sm text-muted-foreground">
                Subscription started: {new Date(subscription.startTime).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                User ID: {user.uid.substring(0, 8)}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
