'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>You are logged in as {user?.email}.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All previous subscription data and gating pages have been removed as requested. 
              You can now start building your custom dashboard modules here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
