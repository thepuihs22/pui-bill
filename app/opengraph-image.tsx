import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ขายคอนโด | Condo for Sale | ราคาดี ตำแหน่งดี'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #fef3c7 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        />
        
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 20px 0',
              lineHeight: 1.2,
              maxWidth: '1000px',
            }}
          >
            ขายคอนโด | Condo for Sale
          </h1>
          
          {/* Subtitle */}
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 30px 0',
              lineHeight: 1.3,
            }}
          >
            ราคาดี ตำแหน่งดี | Best Price & Location
          </h2>
          
          {/* Price Badge */}
          <div
            style={{
              background: '#dc2626',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '36px',
              fontWeight: 'bold',
              margin: '0 0 30px 0',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)',
            }}
          >
            ราคาพิเศษ | Special Price
          </div>
          
          {/* Property Details */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: '24px',
              color: '#4b5563',
              margin: '0 0 30px 0',
            }}
          >
            <span>หลายขนาด</span>
            <span>•</span>
            <span>หลายชั้น</span>
            <span>•</span>
            <span>พร้อมเข้าอยู่</span>
          </div>
          
          {/* Location */}
          <div
            style={{
              fontSize: '28px',
              color: '#059669',
              fontWeight: '600',
              margin: '0 0 20px 0',
            }}
          >
            ตำแหน่งดี ใกล้รถไฟฟ้า | Prime Location Near BTS
          </div>
          
          {/* Contact Info */}
          <div
            style={{
              fontSize: '20px',
              color: '#6b7280',
              margin: '0',
            }}
          >
            ติดต่อสอบถาม | Contact for Details
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '80px',
            height: '80px',
            background: '#3b82f6',
            borderRadius: '50%',
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '60px',
            height: '60px',
            background: '#10b981',
            borderRadius: '50%',
            opacity: 0.1,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
} 