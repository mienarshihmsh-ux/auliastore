
import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'FashionStore - Toko Online',
  description: 'Temukan koleksi fashion terbaik kami',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <Script 
          src="https://app.sandbox.midtrans.com/snap/snap.js" 
          data-client-key="YOUR_MIDTRANS_CLIENT_KEY" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
