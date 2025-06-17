import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;
  
  // Handle production environment
  if (hostname === 'splitbill.futureboard.xyz') {
    // Don't rewrite if the path already includes /splitbill or is /app
    if (pathname.startsWith('/splitbill/') || pathname === '/app') {
      return NextResponse.next();
    }
    
    // Rewrite all paths to include /splitbill prefix
    return NextResponse.rewrite(new URL('/splitbill' + pathname, request.url));
  }
  
  // Handle local development
  // If accessing /api or /share directly, rewrite to include /splitbill
  if (pathname.startsWith('/api/') || pathname.startsWith('/share/')) {
    return NextResponse.rewrite(new URL('/splitbill' + pathname, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};