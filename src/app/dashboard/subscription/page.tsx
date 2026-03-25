
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Smartphone, Loader2, Timer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import Script from 'next/script';
import { doc, setDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const plans = [
  {
    name: "Basic",
    price: "₹1",
    amount: 1,
    description: "Ideal for exploring our core digitalization concepts.",
    features: [
      "Access to public solutions",
      "Standard AI Assistant access",
      "Community support",
      "1 Monthly inquiry"
    ],
    active: false
  },
  {
    name: "Business",
    price: "₹2",
    amount: 2,
    description: "Advanced automation tools for growing enterprises.",
    features: [
      "Everything in Basic",
      "Smart Dashboard access",
      "Priority AI Assistant",
      "24/7 Technical support",
      "Unlimited inquiries"
    ],
    active: false,
    highlight: true
  },
  {
    name: "Enterprise",
    price: "₹3",
    amount: 3,
    description: "Fully bespoke smart solutions tailored to your scale.",
    features: [
      "Everything in Business",
      "Custom IoT integration",
      "Dedicated account manager",
      "On-site consultation",
      "SLA guarantees"
    ],
    active: false
  }
];

export default function SubscriptionPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'userProfiles', user.uid);
  }, [db, user]);

  const { data: profile } = useDoc(profileRef);
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
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, expiresAt]);

  const handleSubscribeClick = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setIsPhoneDialogOpen(true);
  };

  const confirmSubscription = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    if (!selectedPlan) return;

    if (typeof (window as any).Razorpay === 'undefined') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Razorpay SDK is still loading. Please wait a moment and try again.",
      });
      return;
    }

    setIsProcessing(true);

    const options = {
      key: "rzp_live_SLDr4YBwreC3VB", 
      amount: selectedPlan.amount * 100, 
      currency: "INR",
      name: "A S Technosystems",
      description: `${selectedPlan.name} Plan Subscription`,
      image: "https://picsum.photos/seed/ast/200/200",
      handler: async function (response: any) {
        setIsProcessing(false);
        setIsPhoneDialogOpen(false);
        setPhoneNumber('');

        const durationMs = selectedPlan.amount === 1 ? 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + durationMs).toISOString();

        if (user && db) {
          try {
            const userRef = doc(db, 'userProfiles', user.uid);
            await setDoc(userRef, {
              subscription: {
                planId: selectedPlan.name,
                status: 'active',
                expiresAt: expiresAt
              },
              updatedAt: new Date().toISOString()
            }, { merge: true });

            toast({
              title: "Payment Completed",
              description: "Your subscription is now active. Thank you for choosing A S Technosystems!",
            });
          } catch (e) {
            console.error("Error updating user profile:", e);
            toast({
              variant: "destructive",
              title: "Profile Update Failed",
              description: "Payment was successful, but we couldn't update your status. Please contact support.",
            });
          }
        }
      },
      prefill: {
        name: user?.displayName || user?.email?.split('@')[0] || "Valued Client",
        email: user?.email || "",
        contact: phoneNumber,
      },
      notes: {
        plan_name: selectedPlan.name,
        user_id: user?.uid
      },
      theme: {
        color: "hsl(var(--primary))",
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
          toast({
            variant: "destructive",
            title: "Payment Cancelled",
            description: "The payment process was closed before completion.",
          });
        }
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay initialization error:", err);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Could not open the payment gateway. Please try again later.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="afterInteractive" 
      />
      
      {/* Active Subscription Status */}
      {status === 'active' && (
        <Card className="border-primary bg-primary/5 mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Your Active Subscription</CardTitle>
              </div>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase">
                {subscription?.planId}
              </div>
            </div>
            <CardDescription>
              Your plan is currently active and all features are unlocked.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-6 mt-4">
              <div className="flex items-center gap-3 bg-background p-4 rounded-lg border shadow-sm">
                <Timer className="h-8 w-8 text-primary animate-pulse" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Time Remaining</p>
                  <p className="text-2xl font-mono font-bold text-primary">{timeLeft || "--h --m --s"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expires on:</p>
                <p className="font-semibold">{new Date(expiresAt!).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mx-auto max-w-4xl text-center mb-10">
        <h2 className="text-2xl font-bold">Choose your path to Digital Transformation</h2>
        <p className="text-muted-foreground mt-2">Scalable plans designed to fit your business maturity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(
            "flex flex-col relative transition-all duration-300 hover:shadow-xl",
            plan.highlight && "border-primary shadow-lg md:scale-105 z-10",
            status === 'active' && subscription?.planId === plan.name && "border-green-500 bg-green-50/10"
          )}>
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                RECOMMENDED
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {status === 'active' && subscription?.planId === plan.name && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">/mo</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.highlight ? 'default' : 'secondary'}
                onClick={() => handleSubscribeClick(plan)}
                disabled={status === 'active' && subscription?.planId === plan.name}
              >
                {status === 'active' && subscription?.planId === plan.name 
                  ? 'Current Plan' 
                  : 'Subscribe Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="mt-12 bg-muted/50 border-dashed">
        <CardHeader className="text-center">
          <CardTitle>Need a Custom Solution?</CardTitle>
          <CardDescription>
            Our experts can design a tailored architecture for your specific automation needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="outline">
            Schedule a Consultation
          </Button>
        </CardContent>
      </Card>

      {/* Phone Number Collection Dialog */}
      <Dialog open={isPhoneDialogOpen} onOpenChange={(open) => !isProcessing && setIsPhoneDialogOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              Enter your 10-digit mobile number. We will prefill this in the secure payment gateway for your {selectedPlan?.name} plan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="9999999999"
                  className="pl-9"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  type="tel"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPhoneDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={confirmSubscription} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
