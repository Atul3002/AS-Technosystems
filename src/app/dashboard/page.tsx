'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const userProfileRef = user ? doc(db, 'userProfiles', user.uid) : null;
  const { data: profile, isLoading } = useDoc(userProfileRef);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!profile?.subscription?.expiresAt || profile?.subscription?.status !== 'active') return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(profile.subscription.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('Expired');
        // Auto-expire in background if not already updated
        if (userProfileRef && profile.subscription.status === 'active') {
          updateDoc(userProfileRef, {
            'subscription.status': 'expired'
          });
        }
      } else {
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [profile, userProfileRef]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isActive = profile?.subscription?.status === 'active';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            {isActive ? (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {profile?.subscription?.status || 'No Plan'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isActive ? 'Your account is fully active.' : 'Upgrade to access all features.'}
            </p>
          </CardContent>
        </Card>

        {isActive && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{timeLeft}</div>
              <p className="text-xs text-muted-foreground">
                Plan expires on {new Date(profile.subscription.expiresAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Digital Hub</CardTitle>
          <CardDescription>You are logged in as {user?.email}.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isActive ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your subscription is currently inactive. Please choose a plan to get started with our digitalization and automation tools.
              </p>
              <Button asChild>
                <Link href="/dashboard/subscription">View Subscription Plans</Link>
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Thank you for being a subscriber! You now have access to our smart monitoring dashboards and business automation modules.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
