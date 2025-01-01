import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Define public paths that do not require authentication
    const isPublicPath = path === '/login' || 
                        path === '/register' || 
                        path === '/forgot-password';
    
    // Retrieve the token from cookies, defaulting to an empty string if not present
    const token = request.cookies.get('token')?.value || '';

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    // Fetching login status from the server
    const res = await fetch(`${backendURL}/api/loggedin`, {
        method: 'GET',
        credentials: 'include',
    });

    const loggedIn = await res.json();
    console.log('loggedIn: ', loggedIn);

    console.log('Token: ', token);
    console.log('isPublicPath: ', isPublicPath);
    // If the user is trying to access a protected path without authentication, redirect to login
    if (!isPublicPath && !loggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Configuration for the middleware to specify which paths it should apply to
export const config = {
    matcher: [
        '/login',
        '/register',
        '/forgot-password',
        '/dashboard/:path*' // Matches all sub-paths under /dashboard
    ]
}; 