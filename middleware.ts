// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.rewrite(new URL(request.nextUrl.pathname, 'http://localhost:3000'));
    }

    const token = request.cookies.get('accessToken')?.value;

    if (!token && !request.nextUrl.pathname.startsWith('/')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (token && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/estoque', request.url));
    }

    return NextResponse.next();
};