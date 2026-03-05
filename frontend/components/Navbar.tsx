"use client";

import Link from "next/link";
import { Search, Menu, X, Wind } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { SearchOverlay } from "./SearchOverlay";
import { CreateProtocolDialog } from "./CreateProtocolDialog";

import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, LogOut } from "lucide-react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 w-full border-b-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container px-6 md:px-8 flex h-24 items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-4 font-black tracking-[-0.05em] text-2xl uppercase italic">
                        <Wind className="h-8 w-8 text-foreground" />
                        <span className="hidden sm:inline-block">Holistica</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    <Link href="/protocols" className="transition-colors hover:text-foreground">
                        Protocols
                    </Link>
                    <Link href="/discussions" className="transition-colors hover:text-foreground">
                        Discussions
                    </Link>
                    {user && (
                        <CreateProtocolDialog
                            trigger={
                                <button className="transition-colors hover:text-foreground cursor-pointer">
                                    Submit
                                </button>
                            }
                        />
                    )}
                    <SearchOverlay />
                </div>

                <div className="flex items-center gap-4">
                    <div className="md:hidden">
                        <SearchOverlay variant="icon" />
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden rounded-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>

                    <div className="hidden sm:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 px-4 py-2 border-2 border-muted bg-muted/5">
                                    <UserIcon className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{user.name}</span>
                                </div>
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-none h-11 font-black uppercase tracking-widest text-[9px] hover:bg-destructive hover:text-destructive-foreground transition-all group"
                                >
                                    <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline" size="sm" className="rounded-none px-8 h-11 font-black uppercase tracking-widest text-[10px] border-2 hover:bg-foreground hover:text-background transition-all">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="rounded-none px-10 h-11 font-black uppercase tracking-widest text-[10px] bg-foreground text-background hover:bg-foreground/90 transition-all border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                                        Join
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b-2 bg-background overflow-hidden"
                    >
                        <div className="container py-8 flex flex-col gap-6 px-6">
                            <Link href="/protocols" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase tracking-widest">
                                Protocols
                            </Link>
                            <Link href="/discussions" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase tracking-widest">
                                Discussions
                            </Link>
                            <div className="pt-4 border-t-2">
                                <SearchOverlay />
                            </div>
                            <div className="flex flex-col gap-4 pt-4 border-t-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 p-4 border-2 border-muted italic">
                                            <UserIcon className="h-4 w-4" />
                                            <span className="text-sm font-black uppercase">{user.name}</span>
                                        </div>
                                        <Button onClick={() => { logout(); setIsMenuOpen(false); }} variant="destructive" className="rounded-none h-14 font-black uppercase tracking-widest">
                                            Logout Profile
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="outline" className="w-full rounded-none h-14 font-black uppercase tracking-widest border-2">
                                                Login Identity
                                            </Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                            <Button className="w-full rounded-none h-14 font-black uppercase tracking-widest bg-foreground text-background shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                                                Initialize Join
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
