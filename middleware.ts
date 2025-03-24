import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    if (!token && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/estoque', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
