import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    let user = null;
    try {
        const {
            data: { user: authUser },
        } = await supabase.auth.getUser();
        user = authUser;
    } catch (error) {
        console.error('Error getting user:', error);
    }

    // Check user role if logged in
    let userRole = null;
    if (user) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            userRole = profile?.role;
        } catch (error) {
            console.error('Error getting profile:', error);
        }
    }

    // Protect /admin routes (both dashboard and login page)
    // "Security by Obscurity": Only allow access if strictly identified as admin.
    // Otherwise, redirect to home to make the route appear non-existent to others.

    if (request.nextUrl.pathname.startsWith('/admin')) {
        // If not logged in, or if logged in but NOT admin -> Redirect to Home
        if (!user || userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // If access is to the root /admin and user IS admin -> Redirect to dashboard
        if (request.nextUrl.pathname === '/admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return response;
}
