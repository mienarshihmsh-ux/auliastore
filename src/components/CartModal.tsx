"use client"

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { AIRecommendations } from './AIRecommendations';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

export function CartModal({ open, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleCheckout = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Detail Tidak Lengkap",
        description: "Harap isi semua informasi pengiriman.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.endsWith('@gmail.com')) {
       toast({
        title: "Email Tidak Valid",
        description: "Harap gunakan alamat Gmail yang valid.",
        variant: "destructive",
      });
      return;
    }

    // @ts-ignore
    if (typeof snap !== 'undefined') {
      // @ts-ignore
      snap.pay("DUMMY_TOKEN_FOR_PROPOSAL", {
        onSuccess: (result: any) => {
          toast({ title: "Berhasil", description: "Pembayaran telah diterima!" });
          clearCart();
          onClose();
        },
        onError: () => toast({ title: "Kesalahan", description: "Pembayaran gagal.", variant: "destructive" })
      });
    } else {
      toast({ title: "Mode Produksi", description: "Gerbang pembayaran sedang dalam mode demo." });
      setTimeout(() => {
        clearCart();
        onClose();
      }, 2000);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-background border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-headline flex items-center gap-2">
            <ShoppingBag className="text-primary" /> Pilihan Anda
          </SheetTitle>
          <SheetDescription>
            Koleksi fashion eksklusif yang siap untuk dikirimkan.
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <ShoppingBag size={32} />
            </div>
            <p className="text-muted-foreground">Keranjang Anda saat ini kosong.</p>
            <Button variant="outline" onClick={onClose}>Lanjut Menjelajah</Button>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-muted/20 rounded-xl border border-border group">
                  <div className="relative h-20 w-16 bg-muted rounded-lg overflow-hidden shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="object-cover h-full w-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate text-sm">{item.name}</h4>
                    <p className="text-primary font-bold text-xs mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border rounded-lg bg-background">
                        <button 
                          className="p-1.5 hover:bg-muted transition-colors"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button 
                          className="p-1.5 hover:bg-muted transition-colors"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        className="text-muted-foreground hover:text-destructive transition-colors ml-auto"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <AIRecommendations />

            <div className="p-6 bg-card rounded-2xl border border-border space-y-4">
              <h3 className="font-headline font-bold flex items-center gap-2">
                <CreditCard size={18} className="text-primary" /> Info Logistik
              </h3>
              <div className="grid gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    placeholder="Contoh: Adrian Obsidian" 
                    className="bg-background"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground">Alamat Gmail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="adrian@gmail.com" 
                    className={formData.email && !formData.email.endsWith('@gmail.com') ? "border-destructive" : ""}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-muted-foreground">Nomor Telepon</Label>
                  <Input 
                    id="phone" 
                    placeholder="+62..." 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Total Pembayaran</span>
                <span className="text-2xl font-headline font-bold text-primary">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <Button size="lg" className="w-full h-14 text-lg font-headline font-bold group" onClick={handleCheckout}>
                Selesaikan Pembelian
                <CreditCard className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
