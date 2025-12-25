import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Public Routes (always allowed)
    const isPublicRoute = request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/api/') || // Allow APIs (they should handle their own auth if needed)
        request.nextUrl.pathname.startsWith('/_next');

    // If not public and not logged in, redirect to home (where the login modal is)
    if (!isPublicRoute && !user) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 🔒 Proteção da Rota Admin
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 🔒 Redirecionar se já estiver logado e tentar acessar login
    if (request.nextUrl.pathname.startsWith('/login') && user) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
