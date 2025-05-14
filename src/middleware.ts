import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

// Define routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/meetings",
  "/settings",
];

export async function middleware(request: NextRequest) {
  // Check if the path is in our protected routes list
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(`${route}/`)
  );
  
  // For non-protected routes, just update the session and proceed
  if (!isProtectedRoute) {
    return await updateSession(request);
  }
  
  // For protected routes, let the Supabase middleware handle authentication
  // It will redirect to root if the user is not authenticated
  return await updateSession(request, true);
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
    "/((?!_next/static|_next/image|favicon.ico|$).*)",
  ],
};
