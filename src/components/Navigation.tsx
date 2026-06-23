
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Toggle Button (Menu <-> X) */}
        <button 
          className="md:hidden p-2 text-gray-800 hover:text-primary transition-all duration-300 transform active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} className="animate-in fade-in zoom-in" /> : <Menu size={24} className="animate-in fade-in zoom-in" />}
        </button>

        {/* Logo */}
        <div 
          className="text-2xl font-headline font-bold cursor-pointer bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          onClick={() => handleNavClick('home')}
        >
          {storeName}
        </div>

        {/* Desktop Nav */}
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
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Cart Trigger */}
        <button 
          className="relative p-2 text-gray-800 hover:text-primary transition-colors"
          onClick={onOpenCart}
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop (Below Navbar) */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-20 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Menu (Starts below Navbar) */}
      <div className={cn(
        "fixed top-20 bottom-0 left-0 w-[280px] bg-white z-50 md:hidden transition-transform duration-300 shadow-2xl border-r border-gray-100",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 flex flex-col h-full overflow-y-auto">
          <div className="flex-1 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={cn(
                  "flex items-center justify-between w-full p-4 rounded-xl transition-all",
                  activePage === link.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-4">
                  <link.icon size={20} />
                  <span className="font-semibold">{link.label}</span>
                </div>
                {activePage === link.id && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
