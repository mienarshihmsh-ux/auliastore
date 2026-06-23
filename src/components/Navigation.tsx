
"use client"

import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Home, Package, Image as ImageIcon, Info, Mail, ChevronRight } from 'lucide-react';
import { useCart } from './CartContext';
import { cn } from '@/lib/utils';

export type PageView = 'home' | 'products' | 'gallery' | 'about' | 'contact';

interface NavigationProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  onOpenCart: () => void;
  storeName: string;
}

export function Navigation({ activePage, setActivePage, onOpenCart, storeName }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Hamburger Toggle */}
        <button 
          className="md:hidden p-2 text-gray-800 hover:text-primary transition-colors focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo Branding */}
        <div 
          className="text-2xl font-headline font-bold tracking-tight cursor-pointer bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          onClick={() => handleNavClick('home')}
        >
          {storeName}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={cn(
                "flex items-center gap-2 font-semibold transition-all hover:text-primary relative py-2",
                activePage === link.id ? "text-primary" : "text-gray-600"
              )}
            >
              <link.icon size={18} />
              {link.label}
              {activePage === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Cart Trigger */}
        <button 
          className="relative p-2 text-gray-800 hover:text-primary transition-colors"
          onClick={onOpenCart}
          aria-label="Open Cart"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-20 bg-black/30 backdrop-blur-[2px] z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 top-20 w-[280px] bg-white/98 backdrop-blur-lg z-50 md:hidden transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) border-r border-gray-100 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full bg-white/50">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Eksplorasi</p>
            <h3 className="font-headline font-bold text-gray-800">Menu Utama</h3>
          </div>
          
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={cn(
                  "flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 group",
                  activePage === link.id 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-4">
                  <link.icon size={20} className={cn(
                    "transition-transform group-hover:scale-110",
                    activePage === link.id ? "text-primary" : "text-gray-400 group-hover:text-primary"
                  )} />
                  <span className="font-semibold">{link.label}</span>
                </div>
                {activePage === link.id && <ChevronRight size={16} className="text-primary animate-in slide-in-from-left-2" />}
              </button>
            ))}
          </div>
          
          <div className="p-6 mt-auto border-t border-gray-50">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-2xl border border-primary/10">
              <p className="text-xs text-gray-500 leading-relaxed italic">
                "Temukan ekspresi diri melalui koleksi fashion terbaik di {storeName}."
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
