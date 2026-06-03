"use client"

import React, { useState } from 'react';
import { Product, GalleryItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCart } from './CartContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Badge } from './ui/badge';
import { MapPin, Phone, Mail, Building, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function HomeView({ onShopNow }: { onShopNow: () => void }) {
  const heroes = PlaceHolderImages.filter(img => img.id.startsWith('hero-'));
  
  return (
    <div className="space-y-12 page-entrance">
      <Carousel className="w-full high-fashion-shadow rounded-2xl overflow-hidden">
        <CarouselContent>
          {heroes.map((hero, idx) => (
            <CarouselItem key={idx}>
              <div className="relative h-[400px] md:h-[600px] w-full">
                <Image 
                  src={hero.imageUrl} 
                  alt={hero.description} 
                  fill 
                  className="object-cover"
                  data-ai-hint={hero.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex flex-col justify-end p-8 md:p-16">
                  <h2 className="text-4xl md:text-6xl font-headline font-bold text-white max-w-2xl mb-4 leading-tight">
                    {idx === 0 ? "Elevate Your Aesthetic with AuraModa" : "Luxury Defined by Fluid Creativity"}
                  </h2>
                  <p className="text-lg text-white/80 max-w-xl mb-8">
                    Discover our latest collection of intelligently curated high-fashion pieces designed for the modern individual.
                  </p>
                  <Button size="lg" className="w-fit gap-2" onClick={onShopNow}>
                    Shop Collection <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="p-8 bg-card rounded-2xl border border-border flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
            <Badge variant="outline" className="border-primary text-primary">AI</Badge>
          </div>
          <h3 className="font-headline font-bold text-xl mb-2">Style Curator</h3>
          <p className="text-muted-foreground text-sm">Our AI analyzes your taste to recommend perfect accessories.</p>
        </div>
        <div className="p-8 bg-card rounded-2xl border border-border flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-4">
            <Building size={24} />
          </div>
          <h3 className="font-headline font-bold text-xl mb-2">Artisan Quality</h3>
          <p className="text-muted-foreground text-sm">Every piece is crafted with obsessive attention to luxury detail.</p>
        </div>
        <div className="p-8 bg-card rounded-2xl border border-border flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-4">
            <ArrowRight size={24} />
          </div>
          <h3 className="font-headline font-bold text-xl mb-2">Swift Delivery</h3>
          <p className="text-muted-foreground text-sm">Global logistics for the high-speed fashion enthusiast.</p>
        </div>
      </section>
    </div>
  );
}

export function ProductsView() {
  const { addToCart } = useCart();
  const products: Product[] = [
    { id: 1, name: "Elegant Silk Dress", description: "Minimalist luxury in high-grade silk.", price: 1250000, stock: 5, imageUrl: PlaceHolderImages.find(p => p.id === 'prod-1')!.imageUrl },
    { id: 2, name: "Obsidian Evening Gown", description: "Deep black velvet with metallic accents.", price: 2400000, stock: 2, imageUrl: PlaceHolderImages.find(p => p.id === 'prod-2')!.imageUrl },
    { id: 3, name: "Arctic Indigo Scarf", description: "Wool-blend with intricate weave pattern.", price: 450000, stock: 12, imageUrl: PlaceHolderImages.find(p => p.id === 'prod-3')!.imageUrl },
    { id: 4, name: "Lavender Bloom Heels", description: "Sculptural heels in soft suede.", price: 1850000, stock: 0, imageUrl: PlaceHolderImages.find(p => p.id === 'prod-4')!.imageUrl },
  ];

  return (
    <div className="space-y-8 page-entrance">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline font-bold">The Catalog</h2>
        <p className="text-muted-foreground">Limited edition pieces from our latest season.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all high-fashion-shadow group">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <Badge variant="destructive" className="uppercase tracking-widest px-4 py-1">Out of Stock</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-headline font-bold text-lg leading-tight">{product.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded", product.stock < 5 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
                  {product.stock} LEFT
                </span>
              </div>
              <Button 
                className="w-full" 
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function GalleryView() {
  const [filter, setFilter] = useState('all');
  const items: GalleryItem[] = [
    { id: 1, title: "Runway Aura", category: "fashion", description: "Live performance at Jakarta Fashion Week", imageUrl: PlaceHolderImages.find(p => p.id === 'gallery-1')!.imageUrl },
    { id: 2, title: "Studio Light", category: "editorial", description: "Obsidian Purple collection shoot", imageUrl: PlaceHolderImages.find(p => p.id === 'gallery-2')!.imageUrl },
    { id: 3, title: "Creative Depth", category: "behind-the-scenes", description: "Fabric testing phase", imageUrl: PlaceHolderImages.find(p => p.id === 'about-1')!.imageUrl },
  ];

  const categories = ['all', 'fashion', 'editorial', 'behind-the-scenes'];

  return (
    <div className="space-y-8 page-entrance">
       <div className="text-center space-y-4">
        <h2 className="text-3xl font-headline font-bold">Visual Ethos</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <Button 
              key={cat} 
              variant={filter === cat ? "default" : "outline"} 
              size="sm"
              className="rounded-full capitalize"
              onClick={() => setFilter(cat)}
            >
              {cat.replace(/-/g, ' ')}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.filter(i => filter === 'all' || i.category === filter).map(item => (
          <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden high-fashion-shadow group">
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white">
              <Badge className="w-fit mb-2">{item.category}</Badge>
              <h3 className="text-xl font-headline font-bold">{item.title}</h3>
              <p className="text-xs text-white/70 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutView() {
  return (
    <div className="space-y-12 page-entrance max-w-4xl mx-auto">
      <div className="relative h-[400px] w-full rounded-2xl overflow-hidden high-fashion-shadow mb-12">
        <Image src={PlaceHolderImages.find(p => p.id === 'about-1')!.imageUrl} alt="About AuraModa" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-white">Our Fluid Story</h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
        </div>
      </div>
      
      <div className="grid gap-12 text-lg text-muted-foreground leading-relaxed">
        <section className="space-y-4">
          <h3 className="text-2xl font-headline font-bold text-foreground">Defining Luxury for the Next Generation</h3>
          <p>
            AuraModa was born from the intersection of Obsidian shadows and Deep Lavender dreams. We believe fashion is not just attire, but an extension of one's aura—a fluid, ever-changing masterpiece.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-card rounded-2xl border border-border">
            <h4 className="font-headline font-bold text-xl text-foreground mb-4">The Vision</h4>
            <p className="text-sm">To synchronize artisanal craftsmanship with intelligent technology, creating garments that react to the wearer's environment and mood.</p>
          </div>
          <div className="p-8 bg-card rounded-2xl border border-border">
            <h4 className="font-headline font-bold text-xl text-foreground mb-4">The Promise</h4>
            <p className="text-sm">Exclusivity without pretension. Quality without compromise. Innovation that respects tradition.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ContactView() {
  return (
    <div className="space-y-8 page-entrance max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline font-bold">Connect with Aura</h2>
        <p className="text-muted-foreground">Visit our flagship studio or reach out via digital channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card rounded-3xl overflow-hidden border border-border high-fashion-shadow">
        <div className="p-8 md:p-12 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Address</h4>
                <p className="font-medium">Sudirman Fashion District, Block A7, Jakarta</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Phone</h4>
                <p className="font-medium">+62 812-3456-7890</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Email</h4>
                <p className="font-medium">concierge@auramoda.id</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <h4 className="font-headline font-bold mb-4">Studio Hours</h4>
            <div className="grid grid-cols-2 text-sm gap-2">
              <span className="text-muted-foreground">Mon - Fri:</span>
              <span>10:00 AM - 08:00 PM</span>
              <span className="text-muted-foreground">Sat - Sun:</span>
              <span>11:00 AM - 06:00 PM</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] lg:h-auto min-h-[400px] relative">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126915.28189814468!2d106.78915598281249!3d-6.229386699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e098d36005%3A0x673907797745778a!2sJakarta%20Fashion%20Hub!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
            className="absolute inset-0 w-full h-full border-0 grayscale invert contrast-125"
            allowFullScreen 
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
