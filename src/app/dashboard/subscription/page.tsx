
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RAZORPAY_KEY_ID = 'rzp_live_SLDr4YBwreC3VB';

const plans = [
  {
    id: 'plan_a',
    name: 'Plan A',
    price: 1,
    description: 'Basic access valid for 24 hours.',
  },
  {
    id: 'plan_b',
    name: 'Plan B',
    price: 2,
    description: 'Standard access valid for 24 hours.',
  },
  {
    id: 'plan_c',
    name: 'Plan C',
    price: 3,
    description: 'Premium access valid for 24 hours.',
  },
];

export default function SubscriptionPage() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
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
    if (!user) {
      toast({ variant: 'destructive', title: 'Login Required', description: 'Please sign in to subscribe.' });
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
          const startTime = new Date();
          const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
          
          const subscriptionRef = doc(db, 'subscriptions', user.uid);
          
          try {
            await setDoc(subscriptionRef, {
              userId: user.uid,
              amount: plan.price,
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              isActive: true,
            });

            toast({
              title: 'Payment Successful',
              description: 'Payment is done successfully, enjoy your plan!',
            });

            router.push('/dashboard');
          } catch (error) {
            console.error('Error saving subscription:', error);
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Payment succeeded but failed to activate plan. Please contact support.',
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

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Choose Your Plan</h2>
        <p className="mt-2 text-muted-foreground">Unlock features for 24 hours with a simple payment.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">₹{plan.price}</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  24 Hours Validity
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Instant Activation
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan)}
                disabled={processingId !== null}
              >
                {processingId === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
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
