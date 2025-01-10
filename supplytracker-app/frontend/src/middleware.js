import { NextResponse } from 'next/server';

export function middleware(request) {
  // Add detailed logging for debugging
  console.log('Request URL:', request.url);
  console.log('All Cookies:', request.cookies.getAll());
  
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register' || path === '/forgot-password';
  
  // Get token with more detailed error handling
  const token = request.cookies.get('token')?.value;
  console.log('Token Value:', token);
  
  if (!isPublicPath && !token) {
    console.log('Redirecting to login - No token found');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Ensure middleware runs on all relevant paths
export const config = {
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/dashboard/:path*'
  ]
};