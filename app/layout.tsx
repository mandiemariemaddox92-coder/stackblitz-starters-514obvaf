import type { Metadata, Viewport } from "next"
import {
  Inter,
  Playfair_Display,
  Dancing_Script,
  Permanent_Marker,
  Great_Vibes,
  JetBrains_Mono,
} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppProvider } from "@/lib/store"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
})

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
})

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vibes",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "SoulGem - Where Souls Connect",
  description:
    "A creative social platform for authentic emotional expression, creativity, and meaningful connection. Your digital diary, creative studio, and safe emotional outlet.",
  keywords: [
    "social media",
    "diary",
    "journal",
    "creative",
    "emotional",
    "authentic",
    "confession",
    "writing",
  ],
  authors: [{ name: "SoulGem" }],
  openGraph: {
    title: "SoulGem - Where Souls Connect",
    description: "Express yourself authentically. Connect meaningfully.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a0a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} ${permanentMarker.variable} ${greatVibes.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <AppProvider>
          {children}
        </AppProvider>
        <Analytics />
      </body>
    </html>
  )
}