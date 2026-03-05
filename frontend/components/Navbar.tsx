"use client";

import Link from "next/link";
import { Search, Menu, X, Wind } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { SearchOverlay } from "./SearchOverlay";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-6 md:px-8 flex h-20 items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-3 font-bold tracking-tighter text-xl">
                        <Wind className="h-7 w-7" />
                        <span className="hidden sm:inline-block">Holistica</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest">
                    <Link href="/protocols" className="transition-opacity hover:opacity-70 text-foreground/60">
                        Protocols
                    </Link>
                    <Link href="/discussions" className="transition-opacity hover:opacity-70 text-foreground/60">
                        Discussions
                    </Link>
                    <SearchOverlay />
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <Button variant="outline" size="sm" className="hidden sm:flex rounded-full px-6 h-9 font-bold uppercase tracking-widest text-[10px]">
                        Login
                    </Button>
                    <Button size="sm" className="rounded-full px-8 h-9 font-bold uppercase tracking-widest text-[10px] bg-foreground text-background hover:bg-foreground/90 transition-all">
                        Join
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b bg-background overflow-hidden"
                    >
                        <div className="container py-4 flex flex-col gap-4">
                            <Link href="/protocols" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">
                                Protocols
                            </Link>
                            <Link href="/discussions" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">
                                Discussions
                            </Link>
                            <SearchOverlay />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
