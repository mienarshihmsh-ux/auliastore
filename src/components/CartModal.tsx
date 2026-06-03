
"use client"

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgOMnVkWK5q3Cavb3o-_okrpK0P5qqngA8r1JsMtv56aGxvb7wjRYOBQkVfSyXP-fIHA/exec';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

export function CartModal({ open, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const isValidName = formData.name.trim().length >= 3 && /^[a-zA-Z\s.'-]+$/.test(formData.name);
  const isValidEmail = /^[a-z0-9][a-z0-9._]*[a-z0-9]@gmail\.com$/i.test(formData.email);
  const indonesiaPhoneRegex = /^(?:(?:\+62|62|0)(?:\d{9,13}))$/;
  const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
  const isValidPhone = indonesiaPhoneRegex.test(cleanPhone) && 
                      (cleanPhone.startsWith('08') || cleanPhone.startsWith('+628') || cleanPhone.startsWith('628')) &&
                      cleanPhone.length >= 10 && cleanPhone.length <= 15;

  const formatPhoneNumber = (phone: string) => {
    let cp = phone.replace(/[\s\-\(\)]/g, '');
    if (cp.startsWith('0')) return '+62' + cp.substring(1);
    if (cp.startsWith('62') && !cp.startsWith('+62')) return '+' + cp;
    if (!cp.startsWith('+')) return '+62' + cp;
    return cp;
  };

  const handleCheckout = async () => {
    const now = Date.now();
    if (now - lastRequestTime < 2000) {
      toast({ title: "Harap Tunggu", description: "Terlalu cepat melakukan request.", variant: "destructive" });
      return;
    }
    setLastRequestTime(now);

    if (cart.length === 0) {
      Swal.fire('Keranjang Kosong', 'Silakan tambahkan produk terlebih dahulu', 'warning');
      return;
    }

    if (!isValidName || !isValidEmail || !isValidPhone) {
      Swal.fire('Data Tidak Valid', 'Harap periksa kembali informasi pengiriman Anda.', 'error');
      return;
    }

    Swal.fire({
      title: 'Memproses...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const payload = {
        action: 'checkout',
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formatPhoneNumber(formData.phone)
        },
        items: cart,
        totalAmount: cartTotal,
        csrf_token: Math.random().toString(36).substring(7)
      };

      const fd = new FormData();
      fd.append('payload', JSON.stringify(payload));

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: fd
      });
      const result = await response.json();
      
      Swal.close();

      if (result.success && result.snapToken) {
        // @ts-ignore
        window.snap.pay(result.snapToken, {
          onSuccess: (r: any) => confirmPayment(r.order_id, r.transaction_id),
          onError: () => Swal.fire('Pembayaran Gagal', 'Terjadi kesalahan saat pembayaran', 'error')
        });
      } else {
        Swal.fire('Checkout Gagal', result.message || 'Terjadi kesalahan', 'error');
      }
    } catch (error) {
      Swal.close();
      Swal.fire('Error', 'Terjadi kesalahan saat checkout!', 'error');
    }
  };

  const confirmPayment = async (orderId: string, transactionId: string) => {
    const payload = {
      action: 'confirm',
      orderId,
      transactionId,
      status: 'success',
      items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
      csrf_token: 'MOCK'
    };

    try {
      const fd = new FormData();
      fd.append('payload', JSON.stringify(payload));
      const response = await fetch(APPS_SCRIPT_URL, { method: 'POST', body: fd });
      const result = await response.json();
      
      if (result.success) {
        clearCart();
        onClose();
        setFormData({ name: '', email: '', phone: '' });
        Swal.fire({
          icon: 'success',
          title: 'Pembayaran Berhasil!',
          text: 'Pesanan Anda sedang diproses. Terima kasih!',
          confirmButtonColor: '#27ae60'
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal konfirmasi pembayaran', 'error');
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-white border-none overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-headline flex items-center gap-2 text-gray-800">
            <ShoppingBag className="text-[#667eea]" /> Keranjang Belanja
          </SheetTitle>
          <SheetDescription className="text-gray-500">
            Pilihan fashion terbaik siap Anda miliki.
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={40} />
            </div>
            <p className="text-gray-500 font-medium">Keranjang Anda kosong.</p>
            <Button variant="outline" className="rounded-full border-[#667eea] text-[#667eea]" onClick={onClose}>Mulai Belanja</Button>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                  <div className="relative h-20 w-20 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="object-cover h-full w-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate text-sm text-gray-800">{item.name}</h4>
                    <p className="text-[#667eea] font-bold text-xs mt-1">Rp {formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <button className="p-1.5 hover:bg-gray-100 transition-colors text-gray-600" onClick={() => updateQuantity(item.id, -1)}><Minus size={12} /></button>
                        <span className="w-8 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                        <button className="p-1.5 hover:bg-gray-100 transition-colors text-gray-600" onClick={() => updateQuantity(item.id, 1)}><Plus size={12} /></button>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 transition-colors ml-auto" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 space-y-4 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 text-gray-800">
                <Truck size={18} className="text-[#667eea]" /> Informasi Pengiriman
              </h3>
              <div className="grid gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nama Lengkap</Label>
                  <div className="relative">
                    <Input 
                      placeholder="Adrian Obsidian" 
                      className={cn("bg-white text-gray-900 h-11 pr-10 border-gray-200", formData.name && (isValidName ? "border-green-500" : "border-red-500"))}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    {formData.name && (isValidName ? <CheckCircle2 className="absolute right-3 top-3 text-green-500" size={18}/> : <XCircle className="absolute right-3 top-3 text-red-400" size={18}/>)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email (Gmail)</Label>
                  <div className="relative">
                    <Input 
                      type="email"
                      placeholder="adrian@gmail.com" 
                      className={cn("bg-white text-gray-900 h-11 pr-10 border-gray-200", formData.email && (isValidEmail ? "border-green-500" : "border-red-500"))}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    {formData.email && (isValidEmail ? <CheckCircle2 className="absolute right-3 top-3 text-green-500" size={18}/> : <XCircle className="absolute right-3 top-3 text-red-400" size={18}/>)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No. Telepon</Label>
                  <div className="relative">
                    <Input 
                      placeholder="081234567890" 
                      className={cn("bg-white text-gray-900 h-11 pr-10 border-gray-200", formData.phone && (isValidPhone ? "border-green-500" : "border-red-500"))}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    {formData.phone && (isValidPhone ? <CheckCircle2 className="absolute right-3 top-3 text-green-500" size={18}/> : <XCircle className="absolute right-3 top-3 text-red-400" size={18}/>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Pembayaran</span>
                <span className="text-2xl font-headline font-bold text-[#667eea]">Rp {formatPrice(cartTotal)}</span>
              </div>
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#27ae60] to-[#2ecc71] hover:opacity-90 transition-all rounded-2xl group shadow-lg shadow-green-200" 
                onClick={handleCheckout}
              >
                Checkout Sekarang
                <CreditCard className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
