'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { CheckCircle2, Loader2, Sparkles, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RAZORPAY_KEY_ID = 'rzp_live_SLDr4YBwreC3VB';

const plans = [
  {
    id: 'plan_a',
    name: 'Plan A',
    price: 1,
    description: 'Basic access to digital hub features.',
    duration: '24 Hours',
  },
  {
    id: 'plan_b',
    name: 'Plan B',
    price: 2,
    description: 'Standard access with improved tools.',
    duration: '24 Hours',
  },
  {
    id: 'plan_c',
    name: 'Plan C',
    price: 3,
    description: 'Full premium access to all smart solutions.',
    duration: '24 Hours',
  },
];

export default function SubscriptionPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const userProfileRef = user ? doc(db, 'userProfiles', user.uid) : null;
  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user || !userProfileRef) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to subscribe.',
      });
      return;
    }

    setProcessingId(plan.id);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: plan.price * 100, // Amount in paise
      currency: 'INR',
      name: 'A S Technosystems',
      description: `Subscription for ${plan.name}`,
      handler: async function (response: any) {
        if (response.razorpay_payment_id) {
          // Calculate expiration: 24 hours from now
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          
          try {
            await updateDoc(userProfileRef, {
              subscription: {
                planId: plan.id,
                status: 'active',
                expiresAt: expiresAt,
              },
              updatedAt: new Date().toISOString(),
            });

            toast({
              title: 'Payment is done!',
              description: `You are now subscribed to ${plan.name}.`,
            });
          } catch (error) {
            console.error('Error updating subscription:', error);
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Payment was successful, but we failed to update your profile. Please contact support.',
            });
          }
        }
        setProcessingId(null);
      },
      prefill: {
        email: user.email,
      },
      theme: {
        color: 'hsl(var(--primary))',
      },
      modal: {
        ondismiss: function () {
          setProcessingId(null);
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const isActive = profile?.subscription?.status === 'active';
  const activePlan = plans.find(p => p.id === profile?.subscription?.planId);

  return (
    <div className="space-y-8">
      {isActive && activePlan && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              Current Active Subscription
            </CardTitle>
            <CardDescription>
              You are currently on the <strong>{activePlan.name}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Expires at: {new Date(profile.subscription.expiresAt).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={profile?.subscription?.planId === plan.id ? 'border-primary shadow-md' : ''}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">
                ₹{plan.price}
                <span className="text-sm font-normal text-muted-foreground"> / {plan.duration}</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Valid for 24 Hours
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Instant Activation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Full Dashboard Access
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan)}
                disabled={processingId !== null || (isActive && profile.subscription.planId === plan.id)}
              >
                {processingId === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : profile?.subscription?.planId === plan.id && isActive ? (
                  'Active Plan'
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
