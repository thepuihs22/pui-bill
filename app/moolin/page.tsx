"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Moolin() {
  const [activeImage, setActiveImage] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

  const images = {
    bedroom: ['bedroom-1.jpg', 'bedroom-2.jpg'],
    living: ['living-1.jpg', 'living-2.jpg', 'living-3.jpg', 'living-4.jpg'],
    common: ['common-area-1.jpg', 'common-area-2.jpg', 'common-area-3.jpg', 'common-area-4.jpg']
  };

  const allImages = [
    ...images.bedroom.map(img => ({ src: img, category: 'bedroom' })),
    ...images.living.map(img => ({ src: img, category: 'living' })),
    ...images.common.map(img => ({ src: img, category: 'common' }))
  ];

  const filteredImages = activeCategory === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === activeCategory);

  // Ensure activeImage is always valid for the current filtered images
  const validActiveImage = Math.min(activeImage, Math.max(0, filteredImages.length - 1));

  useEffect(() => {
    setActiveImage(0);
  }, [activeCategory]);

  const handleCall = () => {
    window.location.href = 'tel:0936636159';
  };

  const handleLine = () => {
    window.open('https://line.me/ti/p/8j-kAlhrT7', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-card shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-border">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-card-foreground mb-1 md:mb-2 leading-tight">
            ขายผ่อนดาวน์ Aspire Sukumvit – Rama4
          </h1>
          <p className="text-sm md:text-lg text-center text-gray-600 dark:text-muted-foreground">
            For Sale Installment Aspire Sukumvit – Rama4
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Price Badge */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block bg-red-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-lg md:text-2xl font-bold shadow-lg">
            ราคา 3.58 ล้านบาท
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Left Column - Images */}
          <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-3 md:p-4 border border-gray-200 dark:border-border">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-card-foreground">ภาพห้อง</h2>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                {['all', 'bedroom', 'living', 'common'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors min-w-fit ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-muted text-gray-700 dark:text-muted-foreground hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category === 'all' ? 'ทั้งหมด' : 
                     category === 'bedroom' ? 'ห้องนอน' :
                     category === 'living' ? 'ห้องนั่งเล่น' : 'ส่วนกลาง'}
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative h-48 sm:h-64 md:h-80 mb-3 md:mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-muted">
                {filteredImages.length > 0 && (
                  <Image
                    src={`/images/moolin/${filteredImages[validActiveImage].src}`}
                    alt="Condo image"
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 md:gap-2">
                {filteredImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-12 sm:h-16 rounded overflow-hidden bg-gray-100 dark:bg-muted ${
                      validActiveImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={`/images/moolin/${img.src}`}
                      alt="Thumbnail"
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
            {/* Basic Info */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4 md:p-6 border border-gray-200 dark:border-border">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-card-foreground">ข้อมูลห้อง</h2>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center">
                  <span className="w-16 md:w-24 text-gray-600 dark:text-muted-foreground text-sm md:text-base">Unit:</span>
                  <span className="font-semibold text-sm md:text-base text-gray-800 dark:text-card-foreground">A33G3M40</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 md:w-24 text-gray-600 dark:text-muted-foreground text-sm md:text-base">ขนาด:</span>
                  <span className="font-semibold text-sm md:text-base text-gray-800 dark:text-card-foreground">25 ตรม. (รวม 41 ตรม.)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 md:w-24 text-gray-600 dark:text-muted-foreground text-sm md:text-base">ชั้น:</span>
                  <span className="font-semibold text-sm md:text-base text-gray-800 dark:text-card-foreground">ชั้น 33</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 md:w-24 text-gray-600 dark:text-muted-foreground text-sm md:text-base">วิว:</span>
                  <span className="font-semibold text-sm md:text-base text-gray-800 dark:text-card-foreground">วิวเมือง</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 md:w-24 text-gray-600 dark:text-muted-foreground text-sm md:text-base">ตำแหน่ง:</span>
                  <span className="font-semibold text-sm md:text-base text-gray-800 dark:text-card-foreground">ห้องริมสุด private</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4 md:p-6 border border-gray-200 dark:border-border">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-card-foreground">สิ่งที่ได้มา</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span className="truncate text-gray-800 dark:text-card-foreground">เครื่องปรับอากาศ 2 ตัว</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span className="truncate text-gray-800 dark:text-card-foreground">Build-in Kitchen</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span className="truncate text-gray-800 dark:text-card-foreground">Build-in bathroom</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span className="truncate text-gray-800 dark:text-card-foreground">บันได</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span className="truncate text-gray-800 dark:text-card-foreground">พื้นลามิเนต</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span className="truncate text-gray-800 dark:text-card-foreground">หัวนอนปรับทิศทางได้</span>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4 md:p-6 border border-gray-200 dark:border-border">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-card-foreground">รายละเอียดโครงการ</h2>
              <div className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700 dark:text-muted-foreground">
                <p>• โครงการสร้างเสร็จ May 2025</p>
                <p>• แพลนโอนห้องชั้น 33 Aug 2025</p>
                <p>• ทำเลเมือง สุขุมวิทชั้นใน</p>
                <p>• Yield พุ่ง 7%*</p>
                <p>• ติดถนนพระราม 4</p>
                <p>• ใกล้ BTS อโศก - MRT สุขุมวิท</p>
                <p>• ส่วนกลางสวยฉ่ำ 3 ชั้น</p>
                <p>• พื้นที่ใหญ่กว่า 5,000 ตร.ม.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-200 dark:border-border">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-card-foreground">รายละเอียดราคา</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-muted-foreground">ตร.ม. ละ:</span>
                <span className="font-semibold text-gray-800 dark:text-card-foreground">103,792.12 THB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-muted-foreground">ราคาหน้าสัญญา:</span>
                <span className="font-semibold text-gray-800 dark:text-card-foreground">3,580,000 THB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-muted-foreground">ค่าจอง:</span>
                <span className="font-semibold text-gray-800 dark:text-card-foreground">5,000 THB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-muted-foreground">ค่าจอง ณ วันทำสัญญา:</span>
                <span className="font-semibold text-gray-800 dark:text-card-foreground">15,000 THB</span>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-muted-foreground">ผ่อนดาวน์เดือนละ:</span>
                <span className="font-semibold text-gray-800 dark:text-card-foreground">6,000++ THB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-muted-foreground">ผู้ขายต้องการรับ Nett:</span>
                <span className="font-semibold text-gray-800 dark:text-card-foreground">3,680,000 THB</span>
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-muted-foreground mt-2">
                <p>• ไม่มีค่าใช้จ่ายในการเปลี่ยนชื่อ</p>
                <p>• ผู้ซื้อผ่อนต่อกับทางโครงการได้</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8 border border-gray-200 dark:border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-card-foreground">ติดต่อเจ้าของ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            {/* QR Code */}
            <div className="text-center order-1 md:order-1">
              <div className="bg-gray-100 dark:bg-muted rounded-lg p-3 md:p-4 inline-block">
                <Image
                  src="/images/moolin/qr-moolin.jpg"
                  alt="QR Code"
                  width={120}
                  height={120}
                  className="rounded w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36"
                />
              </div>
              <p className="mt-2 text-xs md:text-sm text-gray-600 dark:text-muted-foreground">สแกน QR Code เพื่อติดต่อ</p>
            </div>

            {/* Contact Info */}
            <div className="text-center space-y-3 md:space-y-4 order-2 md:order-2">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-card-foreground mb-1 md:mb-2">ไพลิน</h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-muted-foreground">เจ้าของขายผ่อนดาวน์</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-muted-foreground">ซื้อห้องที่ใหญ่กว่าในโครงการเดิม</p>
              </div>
              
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-gray-600 dark:text-muted-foreground">Line ID:</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm md:text-base">moolin</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3 md:space-y-4 order-3 md:order-3">
              <button
                onClick={handleCall}
                className="w-full bg-green-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg text-base md:text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center min-h-[48px] md:min-h-[56px]"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="truncate">โทร: 093-663-6159</span>
              </button>
              
              <button
                onClick={handleLine}
                className="w-full bg-green-500 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg text-base md:text-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center min-h-[48px] md:min-h-[56px]"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                <span className="truncate">ติดต่อผ่าน Line</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-card rounded-lg shadow-lg p-4 md:p-6 border border-gray-200 dark:border-border">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800 dark:text-card-foreground">ข้อมูลเพิ่มเติม</h2>
          <div className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700 dark:text-muted-foreground">
            <p>• ห้อง type นี้ หน้าโครงการขายหมดแล้ว</p>
            <p>• ห้องริมสุด private สุดสุด</p>
            <p>• วิวเมือง และ ไม่โดนตึกใกล้เคียงบังวิว</p>
            <p>• หัวนอนไม่ fix สามารถปรับทิศทางให้เหมาะสมกับแต่ละบุคคล</p>
            <p>• ซิตี้โซนคอนโด ติดถนนพระราม 4</p>
            <p>• ทำเลมีสีสัน ท่ามกลางไลฟ์สไตล์ที่มีแสงสี เอกมัย - ทองหล่อ - พร้อมพงษ์</p>
            <p>• ตอบโจทย์คนเมืองยุคใหม่วิถีชีวิต Work – Active – Retreat</p>
          </div>
        </div>

        {/* More Info Link */}
        <div className="text-center mt-6 md:mt-8">
          <a 
            href="https://www.apthai.com/ebrochure/index.html?project=aspire-sukhumvit-rama4&type=condominium&locale=th" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ดูข้อมูลเพิ่มเติม
          </a>
        </div>

        {/* Hashtags */}
        <div className="text-center mt-6 md:mt-8">
          <div className="flex flex-wrap justify-center gap-1 md:gap-2">
            {['#AspireSukumvitRama4', '#AspireSukumvit', '#คอนโดพระราม4', '#คอนโดสุขุมวิท', '#ขายผ่อนดาวน์', '#คอนโดชั้นใน'].map((tag, index) => (
              <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 