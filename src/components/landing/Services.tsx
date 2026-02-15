import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Bot, CloudCog } from 'lucide-react';

const services = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Digitalization',
    description: 'Embrace the future with our comprehensive digitalization services. We help you migrate to the cloud, optimize processes, and leverage data analytics for smarter business decisions.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Automation',
    description: 'Streamline your operations with intelligent automation. From RPA to advanced workflow automation, we reduce manual tasks, minimize errors, and boost your operational speed.',
  },
  {
    icon: <CloudCog className="h-8 w-8 text-primary" />,
    title: 'Smart Solutions',
    description: 'Innovate with our smart solutions. We develop and deploy IoT devices, AI-driven platforms, and predictive analytics to create connected and intelligent environments.',
  },
];

export function Services() {
  return (
    <section id="services" className="container space-y-12 py-16 md:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Core Expertise</h2>
        <p className="mt-4 text-lg text-foreground/80">
          We specialize in three key areas to drive your business forward.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-4">
              {service.icon}
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-foreground/80">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
