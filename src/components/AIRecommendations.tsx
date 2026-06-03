"use client"

import React, { useState, useEffect } from 'react';
import { suggestAccessories, AccessorySuggestionOutput } from '@/ai/flows/ai-accessory-suggestions';
import { useCart } from './CartContext';
import { Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function AIRecommendations() {
  const { cart } = useCart();
  const [recommendations, setRecommendations] = useState<AccessorySuggestionOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      setRecommendations(null);
      return;
    }

    const fetchRecs = async () => {
      setLoading(true);
      try {
        const res = await suggestAccessories({
          cartItems: cart.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity
          }))
        });
        setRecommendations(res);
      } catch (e) {
        console.error("AI Fetch Error", e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRecs, 1000);
    return () => clearTimeout(timer);
  }, [cart]);

  if (cart.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-primary animate-pulse" size={20} />
        <h3 className="text-lg font-headline font-semibold">AI Style Recommendations</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground gap-3">
          <Loader2 className="animate-spin" size={20} />
          <span>Curating your style...</span>
        </div>
      ) : recommendations?.suggestions ? (
        <div className="grid gap-4">
          {recommendations.suggestions.map((rec, idx) => (
            <Card key={idx} className="bg-muted/30 border-primary/10 overflow-hidden group hover:border-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-primary group-hover:translate-x-1 transition-transform">{rec.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{rec.description}</p>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">
                    PRO TIP
                  </div>
                </div>
                <div className="mt-3 text-xs bg-background/50 p-2 rounded italic text-foreground/80">
                  "{rec.reason}"
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">Add items to see personalized pairings.</p>
      )}
    </div>
  );
}
