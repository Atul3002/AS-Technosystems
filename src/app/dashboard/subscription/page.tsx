'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    name: "Basic",
    price: "₹1",
    description: "Ideal for exploring our core digitalization concepts.",
    features: [
      "Access to public solutions",
      "Standard AI Assistant access",
      "Community support",
      "1 Monthly inquiry"
    ],
    active: true
  },
  {
    name: "Business",
    price: "₹2",
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

  const handleSubscribe = (planName: string) => {
    toast({
      title: "Subscription Initiated",
      description: `You have selected the ${planName} plan. Redirecting to payment gateway...`,
    });
  };

  return (
    <div className="space-y-6">
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
              {plan.active ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  variant={plan.highlight ? 'default' : 'secondary'}
                  onClick={() => handleSubscribe(plan.name)}
                >
                  Subscribe Now
                </Button>
              )}
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
