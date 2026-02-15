import { Logo } from '@/components/icons';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <p className="text-center text-sm leading-loose text-foreground/80 md:text-left">
            Built by A S Technosystems. &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-6 w-6 text-foreground/60 transition-colors hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="GitHub">
            <Github className="h-6 w-6 text-foreground/60 transition-colors hover:text-foreground" />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6 text-foreground/60 transition-colors hover:text-foreground" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
