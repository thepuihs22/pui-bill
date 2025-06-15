import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  
  if (hostname === 'splitbill.futureboard.xyz') {
    // Don't rewrite API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    
    // Rewrite to /splitbill route for non-API paths
    return NextResponse.rewrite(new URL('/splitbill' + request.nextUrl.pathname, request.url));
  }
  
  // Default behavior for futureboard.xyz and www.futureboard.xyz
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};