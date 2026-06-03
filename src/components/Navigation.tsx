"use client"

import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Home, Package, Image as ImageIcon, Info, Mail } from 'lucide-react';
import { useCart } from './CartContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export type PageView = 'home' | 'products' | 'gallery' | 'about' | 'contact';

interface NavigationProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  onOpenCart: () => void;
}

export function Navigation({ activePage, setActivePage, onOpenCart }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'products', label: 'Produk', icon: Package },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon },
    { id: 'about', label: 'Tentang', icon: Info },
    { id: 'contact', label: 'Kontak', icon: Mail },
  ] as const;

  const handleNavClick = (page: PageView) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div 
          className="text-2xl font-headline font-bold tracking-tight cursor-pointer bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          onClick={() => handleNavClick('home')}
        >
          AURAMODA
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={cn(
                "flex items-center gap-2 font-medium transition-colors hover:text-primary",
                activePage === link.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              <link.icon size={18} />
              {link.label}
            </button>
          ))}
        </div>

        <button 
          className="relative p-2 text-foreground hover:text-primary transition-colors"
          onClick={onOpenCart}
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 top-20 bg-background z-40 md:hidden transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={cn(
                "flex items-center gap-4 text-xl font-medium p-4 rounded-xl border border-transparent active:border-primary/20 transition-all",
                activePage === link.id ? "text-primary bg-primary/5" : "text-muted-foreground"
              )}
            >
              <link.icon size={24} />
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
