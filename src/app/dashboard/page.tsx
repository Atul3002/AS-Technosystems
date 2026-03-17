'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Bot, 
  CloudCog, 
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useUser();

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
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold uppercase">Free</div>
            <p className="text-xs text-muted-foreground">Limited features</p>
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
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader>
            <CardTitle>Unlock Full Potential</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Upgrade to a premium plan to access advanced AI automation and IoT insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <Link href="/dashboard/subscription">
                View Premium Plans <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper utility (inline for simplicity or import)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
