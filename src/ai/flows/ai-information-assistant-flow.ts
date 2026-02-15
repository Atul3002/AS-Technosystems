'use server';
/**
 * @fileOverview An AI assistant flow for A S Technosystems to answer questions about their digitalization, automation, and smart solutions.
 *
 * - aiInformationAssistant - A function that handles user questions about A S Technosystems' services.
 * - AiInformationAssistantInput - The input type for the aiInformationAssistant function.
 * - AiInformationAssistantOutput - The return type for the aiInformationAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiInformationAssistantInputSchema = z.object({
  question: z.string().describe("The user's natural language question about A S Technosystems' offerings."),
});
export type AiInformationAssistantInput = z.infer<typeof AiInformationAssistantInputSchema>;

const AiInformationAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI assistant\'s comprehensive answer to the user\'s question.'),
});
export type AiInformationAssistantOutput = z.infer<typeof AiInformationAssistantOutputSchema>;

export async function aiInformationAssistant(input: AiInformationAssistantInput): Promise<AiInformationAssistantOutput> {
  return aiInformationAssistantFlow(input);
}

const aiInformationAssistantPrompt = ai.definePrompt({
  name: 'aiInformationAssistantPrompt',
  input: {schema: AiInformationAssistantInputSchema},
  output: {schema: AiInformationAssistantOutputSchema},
  prompt: `You are an AI assistant for A S Technosystems, a company specializing in digitalization, automation, and smart solutions. Your primary goal is to provide instant, accurate, and comprehensive answers to user questions about these topics as they relate to A S Technosystems' services.

A S Technosystems offers cutting-edge solutions to help businesses transform digitally, streamline operations through automation, and implement intelligent technologies for improved efficiency and decision-making. Our services include, but are not limited to:
-   **Digitalization:** Helping businesses adopt digital technologies to improve processes, customer experiences, and overall business models. This includes cloud migration, digital transformation strategies, and data analytics integration tailored to modern business needs.
-   **Automation:** Implementing robotic process automation (RPA), intelligent automation, and advanced workflow automation to significantly reduce manual effort, increase operational speed, and minimize errors across various business functions and industries.
-   **Smart Solutions:** Developing and deploying innovative IoT solutions, AI-driven platforms, sophisticated predictive analytics, and smart infrastructure to create connected, intelligent, and highly responsive environments that drive informed decision-making.

When answering, focus on how A S Technosystems provides these services and their benefits to clients. If a question goes beyond the scope of these services or the provided information about A S Technosystems, politely state that you can only provide information related to their digitalization, automation, and smart solutions.

Please answer the following question:

Question: {{{question}}}`,
});

const aiInformationAssistantFlow = ai.defineFlow(
  {
    name: 'aiInformationAssistantFlow',
    inputSchema: AiInformationAssistantInputSchema,
    outputSchema: AiInformationAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await aiInformationAssistantPrompt(input);
    return output!;
  }
);
