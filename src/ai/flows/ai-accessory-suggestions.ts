'use server';
/**
 * @fileOverview An AI-powered tool that suggests accessory pairings based on items currently in the user's cart.
 *
 * - suggestAccessories - A function that handles the accessory suggestion process.
 * - AccessorySuggestionInput - The input type for the suggestAccessories function.
 * - AccessorySuggestionOutput - The return type for the suggestAccessories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CartItemSchema = z.object({
  id: z.number().describe('The unique identifier of the product.'),
  name: z.string().describe('The name of the product.'),
  description: z.string().optional().describe('A brief description of the product.'),
  price: z.number().describe('The price of the product.'),
  quantity: z.number().describe('The quantity of the product in the cart.'),
});

const AccessorySuggestionInputSchema = z.object({
  cartItems: z.array(CartItemSchema).describe('A list of items currently in the user\'s shopping cart.'),
});
export type AccessorySuggestionInput = z.infer<typeof AccessorySuggestionInputSchema>;

const SuggestedAccessorySchema = z.object({
  name: z.string().describe('The name of the suggested accessory.'),
  description: z.string().describe('A brief description of the suggested accessory.'),
  reason: z.string().describe('The reason why this accessory is suggested as a good pairing.'),
});

const AccessorySuggestionOutputSchema = z.object({
  suggestions: z.array(SuggestedAccessorySchema).describe('A list of suggested accessories.'),
});
export type AccessorySuggestionOutput = z.infer<typeof AccessorySuggestionOutputSchema>;

export async function suggestAccessories(input: AccessorySuggestionInput): Promise<AccessorySuggestionOutput> {
  return aiAccessorySuggestionsFlow(input);
}

const accessorySuggestionPrompt = ai.definePrompt({
  name: 'accessorySuggestionPrompt',
  input: {schema: AccessorySuggestionInputSchema},
  output: {schema: AccessorySuggestionOutputSchema},
  prompt: `You are an expert fashion stylist and personal shopper.
Your task is to suggest accessories that would perfectly complement the items in the user's shopping cart.
The goal is to help the user complete their outfit and discover new complementary products.
Consider the style, color, and function of the cart items when making suggestions.
Provide a name, description, and a brief reason for each suggestion.

Items currently in the cart:
{{#each cartItems}}
- Name: {{{name}}}
  Description: {{{description}}}
  Price: Rp {{{price}}}
  Quantity: {{{quantity}}}
{{/each}}

Based on these items, what accessories would you suggest?`,
});

const aiAccessorySuggestionsFlow = ai.defineFlow(
  {
    name: 'aiAccessorySuggestionsFlow',
    inputSchema: AccessorySuggestionInputSchema,
    outputSchema: AccessorySuggestionOutputSchema,
  },
  async input => {
    const {output} = await accessorySuggestionPrompt(input);
    return output!;
  }
);
