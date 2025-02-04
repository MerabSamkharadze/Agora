import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ToastProvider } from "@/context/ToastContext";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { PremiumProvider } from "@/context/PremiumContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Agora",
  description: "Give Wings to Your Talent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PremiumProvider>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <header className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                      <Link className="text-2xl text-primary mr-8" href={"/"}>
                        Agora
                      </Link>

                      <div className="flex items-center gap-2"></div>
                    </div>

                    <HeaderAuth />
                  </header>
                </nav>
                <div className="flex flex-col gap-20 items-center w-screen p-5">
                  <ToastProvider>{children}</ToastProvider>
                </div>

                <footer className="w-full flex items-center justify-between px-6 py-6 border-t border-text-white  text-sm gap-8">
                  <div className="text-center">
                    <p>
                      &copy; {new Date().getFullYear()} Agora. All Rights
                      Reserved.
                    </p>
                  </div>
                  <div>
                    <ThemeSwitcher />
                  </div>
                </footer>
              </div>
            </main>
          </PremiumProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
