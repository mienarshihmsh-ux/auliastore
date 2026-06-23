
"use client"

import React, { useState, useEffect } from 'react';
import { CartProvider } from '@/components/CartContext';
import { Navigation, PageView } from '@/components/Navigation';
import { HomeView, ProductsView, GalleryView, AboutView, ContactView } from '@/components/Views';
import { CartModal } from '@/components/CartModal';
import { Instagram, Facebook, Youtube, Package } from 'lucide-react';
import { FooterData } from '@/lib/types';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgOMnVkWK5q3Cavb3o-_okrpK0P5qqngA8r1JsMtv56aGxvb7wjRYOBQkVfSyXP-fIHA/exec';

const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.5a6.5 6.5 0 0 1-11.5 4.01c-1.42-1.83-1.54-4.59-.31-6.55 1.12-1.92 3.48-3.05 5.68-2.67V9.16c-1.39-.06-2.77-.35-4.06-1.01A8.25 8.25 0 0 1 4.5 4.5C3.3 3.2 2.8 1.5 2.8 0h4.03c.02 1.31.54 2.61 1.47 3.61.93.99 2.21 1.56 3.54 1.7V.02z"/>
  </svg>
);

export default function FashionStoreApp() {
  const [activePage, setActivePage] = useState<PageView>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [footer, setFooter] = useState<FooterData>({ storeName: "FashionStore" });

  useEffect(() => {
    fetch(`${APPS_SCRIPT_URL}?type=footer`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.footer) {
          setFooter(data.footer);
        }
      })
      .catch(() => {});
  }, []);

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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#667eea] to-[#764ba2]">
        <Navigation 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onOpenCart={() => setIsCartOpen(true)}
          storeName={footer.storeName}
        />

        <main className="flex-1 container mx-auto px-4 pt-32 pb-16">
          {renderView()}
        </main>

        <footer className="bg-[#2c3e50] text-white py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center space-y-8">
              <h3 className="text-3xl font-headline font-bold flex items-center gap-3">
                <Package className="text-[#667eea]" /> {footer.storeName}
              </h3>
              
              <div className="flex gap-6">
                {footer.facebook && (
                  <a href={footer.facebook} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#667eea] transition-all">
                    <Facebook size={24} />
                  </a>
                )}
                {footer.instagram && (
                  <a href={footer.instagram} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#667eea] transition-all">
                    <Instagram size={24} />
                  </a>
                )}
                {footer.youtube && (
                  <a href={footer.youtube} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#667eea] transition-all">
                    <Youtube size={24} />
                  </a>
                )}
                {footer.tiktok && (
                  <a href={footer.tiktok} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#667eea] transition-all">
                    <TikTokIcon size={24} />
                  </a>
                )}
              </div>

              <p className="text-gray-400 text-sm max-w-lg">
                &copy; 2024 {footer.storeName}. All rights reserved. Kami menghadirkan kualitas fashion terbaik langsung ke depan pintu Anda.
              </p>
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
