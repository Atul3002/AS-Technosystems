import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    name: 'Sarah Johnson',
    title: 'COO, Innovate Inc.',
    quote: "A S Technosystems revolutionized our manufacturing process. Their automation solution increased our output by 40% and significantly reduced errors. It's been a game-changer.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial1'),
  },
  {
    name: 'Michael Chen',
    title: 'Head of IT, Global Logistics',
    quote: "The digitalization roadmap provided by A S Technosystems was clear, concise, and perfectly aligned with our business goals. Their team's expertise is unmatched.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial2'),
  },
  {
    name: 'Emily Rodriguez',
    title: 'City Planner, City of Newhaven',
    quote: "Implementing their smart city platform has given us incredible insights into traffic flow and public services. We're now making data-driven decisions that benefit all our citizens.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial3'),
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="container py-16 md:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by Our Clients</h2>
        <p className="mt-4 text-lg text-foreground/80">
          Hear what our partners have to say about working with A S Technosystems.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="flex flex-col">
            <CardContent className="p-6 flex flex-col flex-1">
              <blockquote className="text-foreground/80 flex-1 before:content-['“'] after:content-['”']">
                {testimonial.quote}
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                {testimonial.image && (
                  <Avatar>
                    <AvatarImage src={testimonial.image.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.image.imageHint} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
