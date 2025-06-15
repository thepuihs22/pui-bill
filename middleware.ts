import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;
  
  // Handle production environment
  if (hostname === 'splitbill.futureboard.xyz') {
    // If the path starts with /splitbill, remove it
    if (pathname.startsWith('/splitbill/')) {
      const newPathname = pathname.replace('/splitbill', '');
      return NextResponse.rewrite(new URL(newPathname, request.url));
    }
    
    // If the path is exactly /splitbill, redirect to root
    if (pathname === '/splitbill') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // For paths that don't start with /splitbill, let them through
    return NextResponse.next();
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