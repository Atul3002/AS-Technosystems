'use client';

import { useEffect, useState } from 'react';
import { getSmartRecommendations } from '@/app/actions';
import { type SmartContentRecommendationsOutput } from '@/ai/flows/smart-content-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

// This content will be used to generate recommendations.
// In a real multi-page app, this would be the actual content of the current page.
const pageContent = `
A S Technosystems provides cutting-edge solutions in digitalization, automation, and smart technologies.
Our digitalization services help businesses transition to modern, cloud-based infrastructures, improving efficiency and data accessibility.
We leverage automation, including Robotic Process Automation (RPA), to streamline workflows and reduce manual labor, allowing your team to focus on high-value tasks.
Our smart solutions encompass IoT, AI, and data analytics to create intelligent systems for manufacturing, logistics, and smart cities, enabling predictive maintenance and optimized operations.
`;

export function ContentRecommendations() {
  const [recommendations, setRecommendations] = useState<SmartContentRecommendationsOutput>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      setError(null);
      const result = await getSmartRecommendations(pageContent);
      if ('error' in result) {
        setError(result.error);
      } else {
        setRecommendations(result);
      }
      setLoading(false);
    }

    fetchRecommendations();
  }, []);

  return (
    <section id="recommendations" className="bg-muted/50 py-16 md:py-24">
      <div className="container space-y-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">For You</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Based on this page, you might be interested in...
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="mt-4 h-10 w-32" />
              </CardContent>
            </Card>
          ))}
          {!loading && error && <p className='text-destructive col-span-3 text-center'>{error}</p>}
          {!loading && !error && recommendations.map((rec, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  {rec.title}
                </CardTitle>
                <CardDescription className="capitalize">{rec.type}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <p className="text-foreground/80">{rec.description}</p>
                <Button asChild variant="link" className="p-0 mt-4 justify-start">
                  <Link href="#contact">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
