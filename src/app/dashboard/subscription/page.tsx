'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RAZORPAY_KEY_ID = 'rzp_live_SLDr4YBwreC3VB';

const plans = [
  {
    id: 'plan_a',
    name: 'Plan A',
    price: 1,
    description: 'Entry-level access for 24 hours. Perfect for exploring our smart solutions.',
    duration: '24 Hours',
  },
  {
    id: 'plan_b',
    name: 'Plan B',
    price: 2,
    description: 'Standard access for 24 hours. Includes advanced monitoring tools.',
    duration: '24 Hours',
  },
  {
    id: 'plan_c',
    name: 'Plan C',
    price: 3,
    description: 'Premium full-suite access for 24 hours. All enterprise features included.',
    duration: '24 Hours',
  },
];

export default function SubscriptionPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
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
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) document.body.removeChild(existingScript);
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
      description: `${plan.name} Subscription`,
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
              title: 'Success!',
              description: 'Payment is done successfully, enjoy your plan!',
            });

            // Redirect to Dashboard home after a short delay
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
          } catch (error) {
            console.error('Error updating subscription:', error);
            toast({
              variant: 'destructive',
              title: 'Update Failed',
              description: 'Payment successful, but profile update failed. Please contact support.',
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

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Choose Your Access</h2>
        <p className="mt-2 text-muted-foreground">Select a plan to unlock the full potential of AST Digital Hub.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={profile?.subscription?.planId === plan.id ? 'border-primary ring-1 ring-primary' : ''}>
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
                  Full Dashboard Access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  AI Assistant Integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Smart Solution Overviews
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
                    Connecting...
                  </>
                ) : profile?.subscription?.planId === plan.id && isActive ? (
                  'Active'
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
