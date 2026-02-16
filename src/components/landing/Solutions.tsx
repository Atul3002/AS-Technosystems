import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const solutions = [
  {
    id: 'solution1',
    title: 'Intelligent Factory Automation',
    description: 'Boost production efficiency and quality with our AI-powered robotics and process automation for manufacturing.',
    tags: ['Manufacturing', 'AI', 'Robotics'],
    image: PlaceHolderImages.find(p => p.id === 'solution1'),
  },
  {
    id: 'solution2',
    title: 'Digital Twin for Infrastructure',
    description: 'Create dynamic virtual models of your physical assets for real-time monitoring, predictive maintenance, and operational optimization.',
    tags: ['IoT', 'Analytics', 'Smart Cities'],
    image: PlaceHolderImages.find(p => p.id === 'solution2'),
  },
  {
    id: 'solution3',
    title: 'Smart Retail Analytics',
    description: 'Understand customer behavior and optimize store layouts with our computer vision and data analytics platform for retail.',
    tags: ['Retail', 'Data Analytics', 'Computer Vision'],
    image: PlaceHolderImages.find(p => p.id === 'solution3'),
  },
  {
    id: 'solution4',
    title: 'Predictive Maintenance',
    description: 'Utilize sensor data and machine learning to predict equipment failures before they happen, minimizing downtime and maintenance costs.',
    tags: ['Industrial IoT', 'Predictive Analytics', 'Maintenance'],
    image: PlaceHolderImages.find(p => p.id === 'solution4'),
  },
  {
    id: 'solution5',
    title: 'Automated Document Processing',
    description: 'Use AI to extract, classify, and validate information from documents like invoices and contracts, reducing manual data entry.',
    tags: ['RPA', 'AI', 'Document Management'],
    image: PlaceHolderImages.find(p => p.id === 'solution5'),
  },
  {
    id: 'solution6',
    title: 'Smart Logistics & Supply Chain',
    description: 'Optimize your supply chain with real-time tracking, demand forecasting, and automated warehouse management.',
    tags: ['Logistics', 'Supply Chain', 'AI'],
    image: PlaceHolderImages.find(p => p.id === 'solution6'),
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="bg-muted/50 py-16 md:py-24">
      <div className="container space-y-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Innovative Solutions</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Discover some of our flagship smart solutions designed for modern challenges.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <Card key={solution.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader className="p-0">
                {solution.image && (
                  <Image
                    src={solution.image.imageUrl}
                    alt={solution.image.description}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint={solution.image.imageHint}
                  />
                )}
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{solution.title}</CardTitle>
                <CardDescription className="mb-4 h-20">{solution.description}</CardDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  {solution.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
