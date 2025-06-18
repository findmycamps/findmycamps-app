import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
