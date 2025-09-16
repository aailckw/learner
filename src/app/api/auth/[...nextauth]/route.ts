import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth returns an object with `handlers` when initialized.
// Use the handlers to export request methods expected by Next.js route handlers.
const nextAuth = NextAuth(authOptions);
export const GET = nextAuth.handlers.GET;
export const POST = nextAuth.handlers.POST;
