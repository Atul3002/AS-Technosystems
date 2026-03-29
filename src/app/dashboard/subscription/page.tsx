'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionPlaceholder() {
  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Subscription Module Removed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The subscription and payment pages have been removed. Access to the dashboard is currently unrestricted for all authenticated users.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
