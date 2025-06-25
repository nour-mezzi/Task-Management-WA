"use client"; 

import { ReactNode, useState , useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
           <ThemeProvider
          attribute="class" 
          defaultTheme="system"
          enableSystem
        >{children}</ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
