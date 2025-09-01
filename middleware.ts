// middleware.ts (project root)
// This middleware wires next-intl routing correctly and only matches / and /(ar|en)/*
import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};
