import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // By wrapping the entire application in a div or main tag with these class names,
    // the Geist fonts will be applied globally as the default sans-serif and mono fonts.
    <AuthProvider>
      <main className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
