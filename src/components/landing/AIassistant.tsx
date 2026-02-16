'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Sparkles } from 'lucide-react';
import { askAI } from '@/app/actions';

export function AIassistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');
    try {
      const result = await askAI({ question });
      if (result && 'answer' in result) {
        setAnswer(result.answer);
      } else if (result && 'error' in result) {
        setAnswer(result.error);
      } else {
        setAnswer('Sorry, I encountered an unexpected error.');
      }
    } catch (error) {
      console.error('Error fetching AI assistant answer:', error);
      setAnswer('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-assistant" className="container py-16 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Have Questions?</h2>
        <p className="mt-4 text-lg text-foreground/80">
          Ask our AI assistant anything about our Digitalization, Automation, and Smart Solutions.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Information Assistant
            </CardTitle>
            <CardDescription>Get instant answers to your questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What is automation?"
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : 'Ask'}
              </Button>
            </form>

            {answer && (
              <div className="mt-6 rounded-md border bg-muted/50 p-4 text-left">
                <p className="text-foreground whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
