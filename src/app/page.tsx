"use client"

import React, { useState } from 'react';
import { CartProvider } from '@/components/CartContext';
import { Navigation, PageView } from '@/components/Navigation';
import { HomeView, ProductsView, GalleryView, AboutView, ContactView } from '@/components/Views';
import { CartModal } from '@/components/CartModal';
import { Instagram, Facebook, Youtube, Send } from 'lucide-react';

export default function AuraModaApp() {
  const [activePage, setActivePage] = useState<PageView>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const renderView = () => {
    switch (activePage) {
      case 'home': return <HomeView onShopNow={() => setActivePage('products')} />;
      case 'products': return <ProductsView />;
      case 'gallery': return <GalleryView />;
      case 'about': return <AboutView />;
      case 'contact': return <ContactView />;
      default: return <HomeView onShopNow={() => setActivePage('products')} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onOpenCart={() => setIsCartOpen(true)}
        />

        <main className="flex-1 container mx-auto px-4 pt-32 pb-16">
          {renderView()}
        </main>

        <footer className="bg-card border-t border-border pt-20 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                <div className="text-2xl font-headline font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AURAMODA
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  A high-fashion laboratory where intelligent design meets artisanal luxury. Crafted for the global avant-garde.
                </p>
                <div className="flex gap-4">
                  {[Instagram, Facebook, Youtube, Send].map((Icon, i) => (
                    <a key={i} href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-headline font-bold text-lg uppercase tracking-widest text-foreground">Discovery</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><button onClick={() => setActivePage('products')} className="hover:text-primary transition-colors">Latest Catalog</button></li>
                  <li><button onClick={() => setActivePage('gallery')} className="hover:text-primary transition-colors">Visual Ethos</button></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Membership</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Gift Cards</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-headline font-bold text-lg uppercase tracking-widest text-foreground">Assistance</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><button onClick={() => setActivePage('contact')} className="hover:text-primary transition-colors">Concierge</button></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Track Orders</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Ethics</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-headline font-bold text-lg uppercase tracking-widest text-foreground">The Aura Insider</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join our curated mailing list for exclusive access to limited drops.
                </p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Gmail..." className="bg-muted border-none rounded-lg px-4 py-2 text-sm flex-1 outline-none ring-1 ring-border focus:ring-primary/50" />
                  <button className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 transition-opacity">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-widest">
              <p>&copy; 2024 AuraModa Collective. Designed for Perfection.</p>
              <div className="flex gap-8">
                <a href="#" className="hover:text-foreground">Terms</a>
                <a href="#" className="hover:text-foreground">Security</a>
                <a href="#" className="hover:text-foreground">Accessibility</a>
              </div>
            </div>
          </div>
        </footer>

        <CartModal 
          open={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
      </div>
    </CartProvider>
  );
}
