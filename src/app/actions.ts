'use server';

import { smartContentRecommendations, SmartContentRecommendationsOutput } from '@/ai/flows/smart-content-recommendations';
import { z } from 'zod';
import { ContactFormSchema } from '@/lib/schemas';
import { aiInformationAssistant, AiInformationAssistantInput } from '@/ai/flows/ai-information-assistant-flow';

export async function getSmartRecommendations(pageContent: string): Promise<SmartContentRecommendationsOutput | { error: string }> {
  try {
    const recommendations = await smartContentRecommendations({ pageContent });
    return recommendations;
  } catch (error) {
    console.error('Error fetching smart recommendations:', error);
    return { error: 'Failed to fetch recommendations.' };
  }
}

export async function submitContactForm(data: z.infer<typeof ContactFormSchema>) {
  const parsedData = ContactFormSchema.safeParse(data);
  if (!parsedData.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  // In a real application, you would send this data to your backend,
  // send an email, or save it to a database.
  console.log('New contact form submission:', parsedData.data);

  return { success: true, message: 'Thank you for your message! We will get back to you soon.' };
}

export async function askAI(input: AiInformationAssistantInput) {
  try {
    const answer = await aiInformationAssistant(input);
    return answer;
  } catch (error) {
    console.error('Error from AI assistant flow:', error);
    return { error: 'Sorry, I was unable to get an answer. Please try again later.' };
  }
}
