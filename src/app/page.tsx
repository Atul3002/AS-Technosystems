import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Services } from '@/components/landing/Services';
import { Solutions } from '@/components/landing/Solutions';
import { Testimonials } from '@/components/landing/Testimonials';
import { ContentRecommendations } from '@/components/landing/ContentRecommendations';
import { Contact } from '@/components/landing/Contact';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Solutions />
        <Testimonials />
        <ContentRecommendations />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
