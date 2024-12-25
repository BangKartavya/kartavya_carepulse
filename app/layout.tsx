import type {Metadata} from "next";
import {Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/theme-provider";
import React from "react";
import {Toaster} from "@/components/ui/toaster";


const fontSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans"
});

export const metadata: Metadata = {
    title: "Carepulse",
    description: "A healthcare management sysetm",
};

const RootLayout = ({children}: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn("min-h-screen bg-dark-300 font-sans antialiased", fontSans.variable)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                >
                    {children}
                </ThemeProvider>
                <Toaster/>
            </body>
        </html>
    );
};

export default RootLayout;
