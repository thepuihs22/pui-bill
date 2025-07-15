import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ขาย คอนโด ยู ดีไลท์ แอท อ่อนนุช สเตชั่น | ราคา 2.49 ล้านบาท",
  description: "ขายคอนโด U Delight @ Onnut Station ขนาด 30 ตรม. 1 ห้องนอน 1 ห้องน้ำ ชั้น 20 วิวสระว่ายน้ำ พร้อมเครื่องใช้ไฟฟ้า Built-in ทั้งห้อง ใกล้ BTS อ่อนนุช 800 ม. ราคา 2.49 ล้านบาท",
  keywords: "คอนโด, ยูดีไลท์, อ่อนนุช, BTS, ขายคอนโด, คอนโดใกล้BTS, คอนโดอ่อนนุช",
  authors: [{ name: "ปุย" }],
  openGraph: {
    title: "ขาย คอนโด ยู ดีไลท์ แอท อ่อนนุช สเตชั่น | ราคา 2.49 ล้านบาท",
    description: "ขายคอนโด U Delight @ Onnut Station ขนาด 30 ตรม. 1 ห้องนอน 1 ห้องน้ำ ชั้น 20 วิวสระว่ายน้ำ พร้อมเครื่องใช้ไฟฟ้า Built-in ทั้งห้อง ใกล้ BTS อ่อนนุช 800 ม. ราคา 2.49 ล้านบาท",
    url: "https://your-domain.com", // Replace with your actual domain
    siteName: "คอนโด ยู ดีไลท์ อ่อนนุช",
    images: [
      {
        url: "/images/living-1.jpg", // Using the first living room image as the main OG image
        width: 1200,
        height: 630,
        alt: "คอนโด ยู ดีไลท์ อ่อนนุช ห้องนั่งเล่น",
      },
      {
        url: "/images/bedroom-1.jpg",
        width: 1200,
        height: 630,
        alt: "คอนโด ยู ดีไลท์ อ่อนนุช ห้องนอน",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ขาย คอนโด ยู ดีไลท์ แอท อ่อนนุช สเตชั่น | ราคา 2.49 ล้านบาท",
    description: "ขายคอนโด U Delight @ Onnut Station ขนาด 30 ตรม. 1 ห้องนอน 1 ห้องน้ำ ชั้น 20 วิวสระว่ายน้ำ พร้อมเครื่องใช้ไฟฟ้า Built-in ทั้งห้อง ใกล้ BTS อ่อนนุช 800 ม. ราคา 2.49 ล้านบาท",
    images: ["/images/living-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex`}
      >
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
