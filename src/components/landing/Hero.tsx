import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="container flex flex-col items-center justify-center py-20 text-center md:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          A S Technosystems
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          A S Technosystems is at the forefront of driving digital transformation. We empower businesses with advanced digitalization, automation, and smart solutions to thrive in the modern era.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="#solutions">
              Explore Our Solutions <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#contact">
              Get in Touch
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
