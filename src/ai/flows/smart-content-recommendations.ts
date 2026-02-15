'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating smart content recommendations.
 *
 * - smartContentRecommendations - A function that provides content recommendations based on page content.
 * - SmartContentRecommendationsInput - The input type for the smartContentRecommendations function.
 * - SmartContentRecommendationsOutput - The return type for the smartContentRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartContentRecommendationsInputSchema = z.object({
  pageContent: z
    .string()
    .describe(
      'The full text content of the current web page for semantic analysis.'
    ),
});
export type SmartContentRecommendationsInput = z.infer<
  typeof SmartContentRecommendationsInputSchema
>;

const RecommendationSchema = z.object({
  title: z.string().describe('The title of the recommended content.'),
  type: z
    .enum(['service', 'article', 'case study', 'solution'])
    .describe('The type of content being recommended (e.g., service, article, case study, solution).'),
  description: z.string().describe('A brief description of the recommended content.'),
});

const SmartContentRecommendationsOutputSchema = z
  .array(RecommendationSchema)
  .describe('A list of recommended services, articles, or case studies.');
export type SmartContentRecommendationsOutput = z.infer<
  typeof SmartContentRecommendationsOutputSchema
>;

export async function smartContentRecommendations(
  input: SmartContentRecommendationsInput
): Promise<SmartContentRecommendationsOutput> {
  return smartContentRecommendationsFlow(input);
}

const smartContentRecommendationsPrompt = ai.definePrompt({
  name: 'smartContentRecommendationsPrompt',
  input: { schema: SmartContentRecommendationsInputSchema },
  output: { schema: SmartContentRecommendationsOutputSchema },
  prompt: `You are an AI assistant for A S Technosystems, a company specializing in digitalization, automation, and smart solutions. Your task is to recommend highly relevant services, articles, or case studies based on the provided page content.

Analyze the following page content semantically and identify key topics and user interests related to digitalization, automation, and smart solutions. Based on this analysis, suggest 3 to 5 highly relevant items that a user might be interested in exploring further from A S Technosystems' offerings.

For each recommendation, provide its title, type (e.g., 'service', 'article', 'case study', 'solution'), and a brief description. Ensure the recommendations are distinct and directly related to the themes present in the page content.

Page Content: {{{pageContent}}}`,
});

const smartContentRecommendationsFlow = ai.defineFlow(
  {
    name: 'smartContentRecommendationsFlow',
    inputSchema: SmartContentRecommendationsInputSchema,
    outputSchema: SmartContentRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await smartContentRecommendationsPrompt(input);
    return output!;
  }
);
