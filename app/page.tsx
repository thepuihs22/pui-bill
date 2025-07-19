"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const condos = [
    {
      id: 'pui',
      title: 'U Delight @ Onnut Station',
      subtitle: 'ขาย คอนโด ยู ดีไลท์ แอท อ่อนนุช สเตชั่น',
      price: '2.49 ล้านบาท',
      size: '30 ตรม.',
      bedrooms: '1 ห้องนอน',
      bathrooms: '1 ห้องน้ำ',
      floor: 'ชั้น 20',
      view: 'วิวสระว่ายน้ำ',
      image: '/images/living-1.jpg',
      contact: 'ปุย',
      phone: '091-142-1142',
      lineId: 'thepuihs22',
      features: ['Built-In ทั้งห้อง', 'ห้องครัวปิด', 'พร้อมเข้าอยู่', 'กล้องวงจรปิด'],
      location: 'BTS อ่อนนุช 800 ม.',
      status: 'ขาย'
    },
    {
      id: 'moolin',
      title: 'Aspire Sukumvit – Rama4',
      subtitle: 'ขายผ่อนดาวน์ Aspire Sukumvit – Rama4',
      price: '3.58 ล้านบาท',
      size: '25 ตรม. (รวม 41 ตรม.)',
      bedrooms: '1 ห้องนอน',
      bathrooms: '1 ห้องน้ำ',
      floor: 'ชั้น 33',
      view: 'วิวเมือง',
      image: '/images/moolin/living-1.jpg',
      contact: 'ไพลิน',
      phone: '093-663-6159',
      lineId: 'moolin',
      features: ['Build-in Kitchen', 'Build-in bathroom', 'บันได', 'พื้นลามิเนต'],
      location: 'BTS อโศก - MRT สุขุมวิท',
      status: 'ขายผ่อนดาวน์'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-card shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-border">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-card-foreground mb-1 md:mb-2 leading-tight">
            คอนโดขาย
          </h1>
          <p className="text-sm md:text-lg text-center text-gray-600 dark:text-muted-foreground">
            Condos For Sale
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-card-foreground mb-4">
            คอนโดคุณภาพ ราคาพิเศษ
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
            ค้นพบคอนโดที่เหมาะกับคุณ พร้อมสิ่งอำนวยความสะดวกครบครัน ทำเลดี ราคาเป็นมิตร
          </p>
        </div>

        {/* Condo Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {condos.map((condo) => (
            <Link 
              key={condo.id}
              href={`/${condo.id}`}
              className="block"
            >
              <div 
                className={`bg-white dark:bg-card rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-border transition-all duration-300 ${
                  hoveredCard === condo.id 
                    ? 'transform -translate-y-2 shadow-2xl ring-2 ring-blue-500' 
                    : 'hover:shadow-xl'
                }`}
                onMouseEnter={() => setHoveredCard(condo.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Status Badge */}
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      condo.status === 'ขายผ่อนดาวน์' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {condo.status}
                    </span>
                  </div>
                  
                  {/* Main Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <Image
                      src={condo.image}
                      alt={condo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  {/* Title and Price */}
                  <div className="mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-card-foreground mb-1">
                      {condo.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground mb-2">
                      {condo.subtitle}
                    </p>
                    <div className="text-xl md:text-2xl font-bold text-red-600">
                      ราคา {condo.price}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-muted-foreground">ขนาด:</span>
                      <span className="font-semibold ml-1 text-gray-800 dark:text-card-foreground">{condo.size}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-muted-foreground">ห้องนอน:</span>
                      <span className="font-semibold ml-1 text-gray-800 dark:text-card-foreground">{condo.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-muted-foreground">ห้องน้ำ:</span>
                      <span className="font-semibold ml-1 text-gray-800 dark:text-card-foreground">{condo.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-muted-foreground">ชั้น:</span>
                      <span className="font-semibold ml-1 text-gray-800 dark:text-card-foreground">{condo.floor}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-card-foreground mb-2">จุดเด่น:</h4>
                    <div className="flex flex-wrap gap-1">
                      {condo.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                      {condo.features.length > 3 && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                          +{condo.features.length - 3} อื่นๆ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-muted-foreground">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {condo.location}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-border">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-card-foreground">{condo.contact}</p>
                      <p className="text-xs text-gray-600 dark:text-muted-foreground">เจ้าของ</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{condo.phone}</p>
                      <p className="text-xs text-gray-600 dark:text-muted-foreground">Line: {condo.lineId}</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4">
                    <div className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors">
                      ดูรายละเอียด
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6 md:p-8 border border-gray-200 dark:border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-card-foreground">
            ติดต่อเรา
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pui Contact */}
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-muted rounded-lg p-4 inline-block mb-4">
                <Image
                  src="/images/qr.jpg"
                  alt="QR Code Pui"
                  width={100}
                  height={100}
                  className="rounded w-20 h-20 md:w-24 md:h-24"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-card-foreground mb-2">ปุย</h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground mb-2">U Delight @ Onnut Station</p>
              <p className="text-sm font-semibold text-green-600">091-142-1142</p>
              <p className="text-xs text-gray-600 dark:text-muted-foreground">Line: thepuihs22</p>
            </div>

            {/* Moolin Contact */}
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-muted rounded-lg p-4 inline-block mb-4">
                <Image
                  src="/images/moolin/qr-moolin.jpg"
                  alt="QR Code Moolin"
                  width={100}
                  height={100}
                  className="rounded w-20 h-20 md:w-24 md:h-24"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-card-foreground mb-2">ไพลิน</h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground mb-2">Aspire Sukumvit – Rama4</p>
              <p className="text-sm font-semibold text-green-600">093-663-6159</p>
              <p className="text-xs text-gray-600 dark:text-muted-foreground">Line: moolin</p>
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className="text-center mt-8">
          <div className="flex flex-wrap justify-center gap-2">
            {['#คอนโดขาย', '#คอนโดอ่อนนุช', '#คอนโดสุขุมวิท', '#คอนโดพระราม4', '#ขายผ่อนดาวน์', '#คอนโดพร้อมอยู่'].map((tag, index) => (
              <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 