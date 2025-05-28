import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import InfloLogo from "@/components/inflo-logo";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Inflo - Share and discover insights",
  description: "A platform for sharing and discovering valuable insights",
};

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <body className="bg-background text-foreground text-base">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 fixed top-0 left-0 z-10 bg-background">
                <div className="w-full max-w-5xl flex md:justify-between justify-center items-center p-3 px-5 text-sm relative">
                  <div className="md:flex hidden gap-5 items-center font-semibold">
                    <Link href={"/feed"}>
                      <InfloLogo />
                    </Link>
                  </div>
                  <div className="md:hidden flex justify-center absolute left-0 right-0">
                    <Link href={"/feed"}>
                      <InfloLogo />
                    </Link>
                  </div>
                  <div className="md:static absolute right-5">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </div>
              </nav>
              <div className="flex flex-col gap-20 max-w-5xl p-5 mt-16 mb-16">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-1 fixed bottom-0 left-0 z-10 bg-background">
                <div className="flex items-center gap-8">
                  <a href="https://github.com/natus-stepanova" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">natus-stepanova</a>
                  <ThemeSwitcher />
                  <a href="https://github.com/dm1tryG" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">dm1tryG</a>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
