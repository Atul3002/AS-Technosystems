import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const featuredSolutions = [
  {
    id: 'solution7',
    title: 'ERP Modules & Business Functions',
    description:
      'Our comprehensive ERP solutions streamline and integrate your core business processes. We offer a suite of customizable modules designed to enhance efficiency, reduce costs, and provide a single source of truth for your entire organization.',
    points: [
      'Financial Management: Automate accounting, invoicing, and financial reporting.',
      'Supply Chain & Inventory: Optimize your supply chain from procurement to delivery.',
      'Human Capital Management (HCM): Manage your workforce, from payroll to talent development.',
      'Customer Relationship Management (CRM): Enhance customer engagement and sales processes.',
    ],
    image: PlaceHolderImages.find((p) => p.id === 'solution7'),
  },
  {
    id: 'solution8',
    title: 'Smart Dashboard Monitoring',
    description:
      'Transform your raw data into actionable insights with our powerful and intuitive smart dashboards. Monitor your key performance indicators (KPIs) in real-time, enabling faster, data-driven decision-making across all departments.',
    points: [
      'Real-Time Data Visualization: Access live data streams through interactive charts and graphs.',
      'Customizable Widgets: Tailor your dashboard to display the metrics that matter most to you.',
      'KPI Tracking & Alerts: Set performance goals and receive automatic alerts for critical events.',
      'Cross-Platform Accessibility: View your dashboards on any device, anytime, anywhere.',
    ],
    image: PlaceHolderImages.find((p) => p.id === 'solution8'),
  },
];

export function FeaturedSolutions() {
  return (
    <section id="featured-solutions" className="container py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powering Your Core Operations</h2>
        <p className="mt-4 text-lg text-foreground/80">
          Dive deeper into two of our key solutions that form the backbone of a modern, data-driven enterprise.
        </p>
      </div>

      <div className="mt-16 space-y-24">
        {featuredSolutions.map((solution, index) => (
          <div key={solution.id} className="grid items-center gap-12 lg:grid-cols-2">
            <div className={cn(index === 1 && 'lg:order-2')}>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{solution.title}</h3>
              <p className="mt-4 text-lg text-foreground/80">{solution.description}</p>
              <ul className="mt-8 space-y-4">
                {solution.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground/80">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(index === 1 && 'lg:order-1')}>
              {solution.image && (
                <Image
                  src={solution.image.imageUrl}
                  alt={solution.image.description}
                  width={600}
                  height={400}
                  className="w-full rounded-lg object-cover shadow-lg"
                  data-ai-hint={solution.image.imageHint}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
