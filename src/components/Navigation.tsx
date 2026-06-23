
"use client"

import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Home, Package, Image as ImageIcon, Info, Mail } from 'lucide-react';
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
        <button 
          className="md:hidden p-2 text-gray-800 hover:text-[#667eea] transition-colors focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div 
          className="text-2xl font-headline font-bold tracking-tight cursor-pointer bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent"
          onClick={() => handleNavClick('home')}
        >
          {storeName}
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={cn(
                "flex items-center gap-2 font-semibold transition-all hover:text-[#667eea] relative py-2",
                activePage === link.id ? "text-[#667eea]" : "text-gray-700"
              )}
            >
              <link.icon size={18} />
              {link.label}
              {activePage === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#667eea] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <button 
          className="relative p-2 text-gray-800 hover:text-[#667eea] transition-colors"
          onClick={onOpenCart}
          aria-label="Open Cart"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-20 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel - Opaque Side Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 top-20 w-[280px] bg-white z-50 md:hidden transition-transform duration-300 ease-in-out border-r border-gray-100 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col p-4 gap-2 h-full bg-white">
          <div className="mb-4 px-4 py-2 border-b border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu Navigasi</p>
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={cn(
                "flex items-center gap-4 text-base font-semibold p-4 rounded-xl transition-all duration-200 w-full text-left group",
                activePage === link.id 
                  ? "text-[#667eea] bg-blue-50 shadow-sm" 
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#667eea]"
              )}
            >
              <link.icon size={20} className={cn(
                "transition-colors",
                activePage === link.id ? "text-[#667eea]" : "text-gray-400 group-hover:text-[#667eea]"
              )} />
              {link.label}
            </button>
          ))}
          
          <div className="mt-auto p-4 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-500 italic">Selamat datang di {storeName}, temukan gaya terbaikmu.</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
