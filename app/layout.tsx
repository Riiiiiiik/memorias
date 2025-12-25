import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather, Dancing_Script } from "next/font/google";
import "./globals.css";
import PrismaticBurst from "./components/PrismaticBurst";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Memorias",
  description: "Uma coleção de nossos momentos especiais",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Memorias",
  },
  icons: {
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Start as strictly app-like
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} ${dancingScript.variable} antialiased min-h-screen overscroll-none`}
      >
        <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none bg-black">
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2}
            speed={0.5}
            distort={1.0}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.25}
            rayCount={24}
            mixBlendMode="lighten"
            colors={['#ff007a', '#4d3dff', '#ffffff']}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
