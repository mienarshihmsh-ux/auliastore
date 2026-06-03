
"use client"

import React, { useState, useEffect } from 'react';
import { Product, GalleryItem, CarouselItem, AboutItem, ContactItem } from '@/lib/types';
import { useCart } from './CartContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Carousel, CarouselContent, CarouselItem as CarouselUIItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Badge } from './ui/badge';
import { MapPin, Phone, Mail, Box, Info as InfoIcon, ImageIcon, Tag, Boxes, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgOMnVkWK5q3Cavb3o-_okrpK0P5qqngA8r1JsMtv56aGxvb7wjRYOBQkVfSyXP-fIHA/exec';

export function HomeView({ onShopNow }: { onShopNow: () => void }) {
  const [carousels, setCarousels] = useState<CarouselItem[]>([]);

  useEffect(() => {
    fetch(`${APPS_SCRIPT_URL}?type=home`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCarousels(data.carousels || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-12 page-entrance">
      {carousels.length > 0 ? (
        <Carousel className="w-full shadow-2xl rounded-2xl overflow-hidden">
          <CarouselContent>
            {carousels.map((slide, idx) => (
              <CarouselUIItem key={idx}>
                <div className="relative h-[300px] md:h-[500px] w-full">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 md:p-16 text-center">
                    <h2 className="text-2xl md:text-4xl font-headline font-bold text-white mb-2 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-sm md:text-lg text-white/80 max-w-xl mx-auto mb-6">
                      {slide.caption}
                    </p>
                  </div>
                </div>
              </CarouselUIItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      ) : (
        <div className="h-[300px] md:h-[500px] bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
          <p className="text-gray-400">Memuat konten...</p>
        </div>
      )}
    </div>
  );
}

export function ProductsView() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${APPS_SCRIPT_URL}?type=products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);

  return (
    <div className="space-y-8 page-entrance">
      <h2 className="text-3xl font-headline font-bold text-white text-center flex items-center justify-center gap-3">
        <Box /> Produk Kami
      </h2>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-80 bg-white/10 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const stock = product.stock || 0;
            return (
              <Card key={product.id} className="overflow-hidden bg-white border-none shadow-lg hover:shadow-2xl transition-all group">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/300'} 
                    alt={product.name} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  {stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Badge variant="destructive" className="uppercase tracking-widest px-4 py-1">Stok Habis</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg leading-tight text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-[#667eea]">Rp {formatPrice(product.price)}</div>
                    <div className={cn(
                      "text-[10px] font-bold flex items-center gap-1",
                      stock === 0 ? "text-red-500" : stock < 10 ? "text-orange-500" : "text-green-600"
                    )}>
                      {stock === 0 ? <XCircle size={14} /> : stock < 10 ? <AlertTriangle size={14} /> : <Boxes size={14} />}
                      {stock === 0 ? "Stok Habis" : `Stok: ${stock}${stock < 10 ? ' (Segera Habis)' : ''}`}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 transition-opacity" 
                    disabled={stock === 0}
                    onClick={() => addToCart(product)}
                  >
                    Tambah ke Keranjang
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}

export function GalleryView() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch(`${APPS_SCRIPT_URL}?type=gallery`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setGalleries(data.galleries || []);
      })
      .catch(() => {});
  }, []);

  const categories = ['all', ...Array.from(new Set(galleries.map(g => g.category).filter(Boolean)))];

  return (
    <div className="space-y-8 page-entrance">
      <h2 className="text-3xl font-headline font-bold text-white text-center flex items-center justify-center gap-3">
        <ImageIcon /> Galeri Foto
      </h2>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <Button 
            key={cat} 
            variant={filter === cat ? "default" : "outline"} 
            size="sm"
            className={cn("rounded-full capitalize", filter === cat ? "bg-[#667eea]" : "bg-white")}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'Semua' : cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.filter(g => filter === 'all' || g.category === filter).map((item, idx) => (
          <div 
            key={idx} 
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
            onClick={() => setSelectedImage(item)}
          >
            <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white">
              <span className="bg-[#667eea] text-[10px] w-fit px-2 py-0.5 rounded-full mb-2">{item.category}</span>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-xs text-white/70 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full h-auto max-h-[80vh] object-contain" />
              <div className="p-6 bg-black/80 text-white text-center">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-sm text-white/70">{selectedImage.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AboutView() {
  const [abouts, setAbouts] = useState<AboutItem[]>([]);

  useEffect(() => {
    fetch(`${APPS_SCRIPT_URL}?type=about`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAbouts(data.abouts || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 page-entrance">
      <h2 className="text-3xl font-headline font-bold text-white text-center flex items-center justify-center gap-3">
        <InfoIcon /> Tentang Kami
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {abouts.map((about, idx) => (
          <Card key={idx} className="overflow-hidden bg-white border-none shadow-xl hover:-translate-y-1 transition-transform">
            <div className="relative h-60">
              <img src={about.imageUrl || 'https://via.placeholder.com/600x400'} alt={about.title} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ChevronRight className="text-[#667eea]" /> {about.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">{about.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ContactView() {
  const [contact, setContact] = useState<ContactItem | null>(null);

  useEffect(() => {
    fetch(`${APPS_SCRIPT_URL}?type=contact`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.contacts?.length > 0) setContact(data.contacts[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 page-entrance">
      <h2 className="text-3xl font-headline font-bold text-white text-center flex items-center justify-center gap-3">
        <Mail /> Kontak Kami
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl max-w-6xl mx-auto">
        <div className="p-8 md:p-12 space-y-8 bg-gradient-to-br from-gray-50 to-white">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <MapPin className="text-[#667eea]" /> Informasi Kontak
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#667eea]">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Telepon</h4>
                <a href={`tel:${contact?.phone}`} className="font-semibold text-gray-800 hover:text-[#667eea]">{contact?.phone || '...'}</a>
              </div>
            </div>

            <div className="flex items-center gap-4 group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#667eea]">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</h4>
                <a href={`mailto:${contact?.email}`} className="font-semibold text-gray-800 hover:text-[#667eea]">{contact?.email || '...'}</a>
              </div>
            </div>

            <div className="flex items-center gap-4 group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#667eea]">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alamat</h4>
                <p className="font-semibold text-gray-800">{contact?.address || '...'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[400px] lg:h-auto min-h-[450px]">
          {contact?.mapUrl ? (
            <iframe 
              src={contact.mapUrl} 
              className="w-full h-full border-0"
              allowFullScreen 
              loading="lazy"
              title="Peta Lokasi"
            />
          ) : (
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">Peta tidak tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
