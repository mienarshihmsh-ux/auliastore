
"use client"

import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFtZ0FEN-ljWl4EYEpIHQcy6AgCFxfGVJT0m6izM2hxY4YiRjozmrIMR2GhJrW4upWYA/exec';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

export function CartModal({ open, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    note: '' 
  });
  const [lastRequestTime, setLastRequestTime] = useState(0);

  // Validation Logic based on requirements
  const isValidName = formData.name.trim().length >= 3 && /^[a-zA-Z\s.'-]+$/.test(formData.name);
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(formData.email);
  const indonesiaPhoneRegex = /^(?:(?:\+62|62|0)(?:\d{9,13}))$/;
  const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
  const isValidPhone = indonesiaPhoneRegex.test(cleanPhone) && 
                      (cleanPhone.startsWith('08') || cleanPhone.startsWith('+628') || cleanPhone.startsWith('628')) &&
                      cleanPhone.length >= 10 && cleanPhone.length <= 15;
  const isValidAddress = formData.address.trim().length >= 10 && formData.address.length <= 500;
  const isValidNote = formData.note.length <= 200;

  // The form is valid only if all required fields are valid
  const isFormValid = isValidName && isValidEmail && isValidPhone && isValidAddress && isValidNote;

  const formatPhoneNumber = (phone: string) => {
    let cp = phone.replace(/[\s\-\(\)]/g, '');
    if (cp.startsWith('0')) return '+62' + cp.substring(1);
    if (cp.startsWith('62') && !cp.startsWith('+62')) return '+' + cp;
    if (!cp.startsWith('+')) return '+62' + cp;
    return cp;
  };

  const handleCheckout = async () => {
    if (!isFormValid) {
      let errorMsg = 'Harap lengkapi data pengiriman Anda dengan benar.';
      if (!isValidName) errorMsg = 'Nama harus minimal 3 karakter.';
      else if (!isValidEmail) errorMsg = 'Harus menggunakan email Gmail (@gmail.com).';
      else if (!isValidPhone) errorMsg = 'Nomor telepon Indonesia tidak valid.';
      else if (!isValidAddress) errorMsg = 'Alamat harus minimal 10 karakter.';
      
      Swal.fire({
        title: 'Data Tidak Lengkap',
        text: errorMsg,
        icon: 'warning',
        confirmButtonColor: '#667eea'
      });
      return;
    }

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

    if (typeof window === 'undefined' || !(window as any).snap) {
      Swal.fire('Sistem Belum Siap', 'Sistem pembayaran sedang dimuat, mohon tunggu sebentar.', 'info');
      return;
    }

    Swal.fire({
      title: 'Memproses...',
      text: 'Menghubungkan ke sistem pembayaran',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      // Sanitasi data sebelum dikirim
      const payload = {
        action: 'checkout',
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formatPhoneNumber(formData.phone),
          address: formData.address.trim(),
          note: formData.note.trim()
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: cartTotal,
        // CSRF Placeholder untuk keamanan tambahan di Apps Script
        csrf_token: Math.random().toString(36).substring(2, 15)
      };

      const fd = new FormData();
      fd.append('payload', JSON.stringify(payload));

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: fd,
        mode: 'cors'
      });
      const result = await response.json();
      
      Swal.close();

      if (result.success && result.snapToken) {
        (window as any).snap.pay(result.snapToken, {
          onSuccess: (r: any) => confirmPayment(r.order_id, r.transaction_id),
          onPending: () => Swal.fire('Menunggu', 'Silakan selesaikan pembayaran Anda', 'info'),
          onError: () => Swal.fire('Pembayaran Gagal', 'Terjadi kesalahan saat pembayaran', 'error'),
          onClose: () => toast({ title: "Pembayaran Dibatalkan", description: "Anda menutup jendela pembayaran." })
        });
      } else {
        Swal.fire('Checkout Gagal', result.message || 'Terjadi kesalahan pada server', 'error');
      }
    } catch (error) {
      Swal.close();
      Swal.fire('Error', 'Gagal menghubungi server. Periksa koneksi internet Anda.', 'error');
    }
  };

  const confirmPayment = async (orderId: string, transactionId: string) => {
    const payload = {
      action: 'confirm',
      orderId,
      transactionId,
      status: 'success',
      items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
      csrf_token: 'SECURITY_VERIFIED'
    };

    try {
      const fd = new FormData();
      fd.append('payload', JSON.stringify(payload));
      const response = await fetch(APPS_SCRIPT_URL, { method: 'POST', body: fd });
      const result = await response.json();
      
      if (result.success) {
        clearCart();
        onClose();
        setFormData({ name: '', email: '', phone: '', address: '', note: '' });
        Swal.fire({
          icon: 'success',
          title: 'Pembayaran Berhasil!',
          text: 'Pesanan Anda sedang diproses. Terima kasih!',
          confirmButtonColor: '#27ae60'
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal konfirmasi pembayaran ke sistem', 'error');
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID').format(price);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white border-none p-0 overflow-hidden max-h-[90vh] flex flex-col [&>button]:text-gray-900 [&>button]:hover:bg-red-500 [&>button]:hover:text-white [&>button]:bg-gray-50 [&>button]:p-2 [&>button]:rounded-full [&>button]:top-4 [&>button]:right-4 transition-all duration-300">
        <DialogHeader className="p-6 border-b border-gray-100 bg-white">
          <DialogTitle className="text-2xl font-headline flex items-center gap-2 text-gray-800">
            <ShoppingBag className="text-primary" /> Keranjang Belanja
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-left">
            Pilihan fashion terbaik siap Anda miliki.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <p className="text-gray-500 font-medium">Keranjang Anda kosong.</p>
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all" onClick={onClose}>Mulai Belanja</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/20 transition-all">
                    <div className="relative h-20 w-20 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="object-cover h-full w-full group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate text-sm text-gray-800">{item.name}</h4>
                      <p className="text-primary font-bold text-xs mt-1">Rp {formatPrice(item.price)}</p>
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
                  <Truck size={18} className="text-primary" /> Informasi Pengiriman
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nama Lengkap</Label>
                    <div className="relative">
                      <Input 
                        placeholder="Nama Lengkap" 
                        className={cn("bg-white text-gray-900 h-11 pr-10 border-gray-200 focus:border-primary transition-all", formData.name && (isValidName ? "border-green-500" : "border-red-500"))}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      {formData.name && (isValidName ? <CheckCircle2 className="absolute right-3 top-3 text-green-500" size={18}/> : <XCircle className="absolute right-3 top-3 text-red-400" size={18}/>)}
                    </div>
                    {formData.name && !isValidName && <p className="text-[10px] text-red-500 font-medium">Nama harus minimal 3 karakter</p>}
                    {formData.name && isValidName && <p className="text-[10px] text-green-600 font-medium">✓ Nama valid</p>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email (Gmail)</Label>
                    <div className="relative">
                      <Input 
                        type="email"
                        placeholder="Email (Gmail)" 
                        className={cn("bg-white text-gray-900 h-11 pr-10 border-gray-200 focus:border-primary transition-all", formData.email && (isValidEmail ? "border-green-500" : "border-red-500"))}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      {formData.email && (isValidEmail ? <CheckCircle2 className="absolute right-3 top-3 text-green-500" size={18}/> : <XCircle className="absolute right-3 top-3 text-red-400" size={18}/>)}
                    </div>
                    {formData.email && !isValidEmail && <p className="text-[10px] text-red-500 font-medium">Harus menggunakan email Gmail (@gmail.com)</p>}
                    {formData.email && isValidEmail && <p className="text-[10px] text-green-600 font-medium">✓ Email Gmail valid</p>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">No. Telepon</Label>
                    <div className="relative">
                      <Input 
                        placeholder="No. Telepon (contoh: 081234567890)" 
                        className={cn("bg-white text-gray-900 h-11 pr-10 border-gray-200 focus:border-primary transition-all", formData.phone && (isValidPhone ? "border-green-500" : "border-red-500"))}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                      {formData.phone && (isValidPhone ? <CheckCircle2 className="absolute right-3 top-3 text-green-500" size={18}/> : <XCircle className="absolute right-3 top-3 text-red-400" size={18}/>)}
                    </div>
                    {formData.phone && !isValidPhone && <p className="text-[10px] text-red-500 font-medium">Nomor telepon tidak valid. Gunakan format Indonesia (08xx atau +62xx)</p>}
                    {formData.phone && isValidPhone && <p className="text-[10px] text-green-600 font-medium">✓ Nomor telepon valid</p>}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Alamat Lengkap</Label>
                    <div className="relative">
                      <Textarea 
                        placeholder="Alamat Lengkap (Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos)" 
                        className={cn("bg-white text-gray-900 min-h-[100px] border-gray-200 focus:border-primary transition-all", formData.address && (isValidAddress ? "border-green-500" : "border-red-500"))}
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      {formData.address && !isValidAddress && <p className="text-[10px] text-red-500 font-medium">Alamat harus minimal 10 karakter dan maksimal 500 karakter</p>}
                      {formData.address && isValidAddress && <p className="text-[10px] text-green-600 font-medium">✓ Alamat valid</p>}
                      <p className={cn("text-[10px] font-bold", formData.address.length > 500 ? "text-red-500" : "text-gray-400")}>
                        {formData.address.length} / 500 karakter
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Catatan Tambahan (Opsional)</Label>
                    <div className="relative">
                      <Textarea 
                        placeholder="Catatan Tambahan (Opsional) - Contoh: Warna, Ukuran, Pesan Khusus, dll" 
                        className={cn("bg-white text-gray-900 min-h-[60px] border-gray-200 focus:border-primary transition-all", formData.note.length > 200 ? "border-red-500" : "border-gray-200")}
                        value={formData.note}
                        onChange={(e) => setFormData({...formData, note: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end mt-1">
                      <p className={cn("text-[10px] font-bold", formData.note.length > 200 ? "text-red-500" : "text-gray-400")}>
                        {formData.note.length} / 200 karakter
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Pembayaran</span>
              <span className="text-2xl font-headline font-bold text-primary">Rp {formatPrice(cartTotal)}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Button 
                size="lg" 
                className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90 transition-all rounded-2xl group shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={handleCheckout}
                disabled={!isFormValid}
              >
                Checkout Sekarang
                <CreditCard className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="ghost"
                size="lg"
                className="w-full md:w-32 h-14 text-gray-500 hover:text-white hover:bg-red-500 rounded-2xl flex items-center justify-center border border-gray-100 transition-all"
                onClick={onClose}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
