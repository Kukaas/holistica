"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, ArrowLeft, Clock, User, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DiscussionListSkeleton } from "@/components/ItemSkeleton";
import { ThreadCard } from "@/components/ThreadCard";

export default function DiscussionsBrowse() {
    const [threads, setThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    async function fetchThreads() {
        setLoading(true);
        try {
            const response = await api.get("/threads", {
                params: { search, page }
            });
            setThreads(response.data.data);
            setPagination(response.data);
        } catch (error) {
            console.error("Error fetching threads:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchThreads();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, page]);

    return (
        <div className="max-w-7xl mx-auto pb-24">
            {/* Header Section */}
            <header className="mb-12 space-y-8">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Home
                </Link>

                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 block">
                        Community
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
                        Discussions
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl font-medium">
                        The collective mind exploring wellness protocols. Join the dialogue.
                    </p>
                </div>
            </header>

            {/* Global Search Bar for Discussions */}
            <section className="sticky top-24 z-40 bg-background/80 backdrop-blur-xl border-y py-8 mb-16 px-4 -mx-4">
                <div className="relative max-w-7xl mx-auto group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                    <Input
                        placeholder="Search all conversations..."
                        className="h-16 pl-14 rounded-none border-2 border-muted hover:border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-foreground transition-all bg-muted/5 text-lg font-bold"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </section>

            {/* Discussions List */}
            <div className="space-y-6">
                {loading ? (
                    <DiscussionListSkeleton />
                ) : threads.length > 0 ? (
                    threads.map((thread, i) => (
                        <motion.div
                            key={thread.id}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <ThreadCard thread={thread} showProtocol={true} />
                        </motion.div>
                    ))
                ) : (
                    <div className="py-40 text-center border-4 border-dashed rounded-[3rem] border-muted/20">
                        <p className="text-sm font-black text-muted-foreground/20 uppercase tracking-[0.4em]">No dialogue found</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.last_page > 1 && (
                <div className="mt-20 flex justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => {
                            setPage(p => p - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="rounded-none border-2 font-black uppercase tracking-widest text-[10px] px-8 h-12"
                    >
                        Prev
                    </Button>
                    <div className="flex items-center px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                        Page {page} of {pagination.last_page}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === pagination.last_page}
                        onClick={() => {
                            setPage(p => p + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="rounded-none border-2 font-black uppercase tracking-widest text-[10px] px-8 h-12"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
