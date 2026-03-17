'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import Script from 'next/script';

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

  const handleSubscribe = (plan: typeof plans[0]) => {
    // Razorpay Standard Checkout Integration
    const options = {
      key: "rzp_live_SLDr4YBwreC3VB", // Provided Key ID
      amount: plan.amount * 100, // Amount in paise (100 paise = 1 INR)
      currency: "INR",
      name: "A S Technosystems",
      description: `${plan.name} Plan Subscription`,
      image: "https://picsum.photos/seed/logo/200/200", // Placeholder for company logo
      handler: function (response: any) {
        toast({
          title: "Payment Successful",
          description: `Thank you for subscribing to the ${plan.name} plan. Payment ID: ${response.razorpay_payment_id}`,
        });
        // In a production app, you would verify this payment on your server
        // using your Secret Key: rUEM6cJiY22kjM8hC0ge1l2S
      },
      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
      },
      theme: {
        color: "hsl(var(--primary))",
      },
      modal: {
        ondismiss: function() {
          toast({
            variant: "destructive",
            title: "Payment Cancelled",
            description: "The subscription process was interrupted.",
          });
        }
      }
    };

    if (typeof (window as any).Razorpay === 'undefined') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Razorpay SDK failed to load. Please refresh the page.",
      });
      return;
    }

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="mx-auto max-w-4xl text-center mb-10">
        <h2 className="text-2xl font-bold">Choose your path to Digital Transformation</h2>
        <p className="text-muted-foreground mt-2">Scalable plans designed to fit your business maturity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(
            "flex flex-col relative transition-all duration-300 hover:shadow-xl",
            plan.highlight && "border-primary shadow-lg md:scale-105 z-10"
          )}>
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                RECOMMENDED
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
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
                onClick={() => handleSubscribe(plan)}
              >
                Subscribe Now
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
    </div>
  );
}
