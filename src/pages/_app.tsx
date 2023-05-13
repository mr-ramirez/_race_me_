import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ClerkProvider>
            <ThemeProvider defaultTheme="light" attribute="class" enableSystem={false}>
                <Component {...pageProps} />
            </ThemeProvider>
        </ClerkProvider>
    );
}
