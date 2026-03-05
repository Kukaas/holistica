"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Search, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ProtocolsBrowse() {
    const [protocols, setProtocols] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("recent");
    const [pagination, setPagination] = useState<any>(null);
    const [page, setPage] = useState(1);

    async function fetchProtocols() {
        setLoading(true);
        try {
            const response = await api.get("/protocols", {
                params: { search, sort, page }
            });
            setProtocols(response.data.data);
            setPagination(response.data);
        } catch (error) {
            console.error("Error fetching protocols:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProtocols();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sort, page]);

    return (
        <div className="max-w-7xl mx-auto pb-24">
            {/* Header Section */}
            <header className="mb-20 space-y-8">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Home
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 block">
                            Registry
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
                            Protocols
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl font-medium">
                            Explore the collective archive of wellness, healing, and biohacking protocols.
                        </p>
                    </div>
                </div>
            </header>

            {/* Filters & Search Bar */}
            <section className="sticky top-24 z-40 bg-background/80 backdrop-blur-xl border-y py-8 mb-16 px-4 -mx-4">
                <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                        <Input
                            placeholder="Search by title, tag, or content..."
                            className="h-16 pl-14 rounded-none border-2 border-muted hover:border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-foreground transition-all bg-muted/5 text-lg font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="h-16 w-full md:w-[240px] rounded-none border-2 border-muted font-black uppercase tracking-widest text-[11px] px-8 hover:bg-muted transition-all">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-2">
                                <SelectItem value="recent" className="font-bold">Most Recent</SelectItem>
                                <SelectItem value="rating" className="font-bold">Highest Rated</SelectItem>
                                <SelectItem value="reviews" className="font-bold">Most Activity</SelectItem>
                                <SelectItem value="upvoted" className="font-bold">Top Upvoted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Protocol Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-80 rounded-none bg-muted animate-pulse border-2" />
                    ))
                ) : protocols.length > 0 ? (
                    protocols.map((protocol, i) => (
                        <motion.div
                            key={protocol.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link href={`/protocols/${protocol.id}`}>
                                <Card className="h-full rounded-none border-2 border-muted hover:border-foreground transition-all group bg-muted/5 shadow-none overflow-hidden hover:shadow-2xl hover:shadow-muted/20">
                                    <CardHeader className="p-10 pb-4">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex flex-wrap gap-2">
                                                {protocol.tags?.slice(0, 2).map((tag: string) => (
                                                    <Badge key={tag} variant="secondary" className="bg-foreground text-background rounded-none text-[9px] uppercase tracking-widest font-black py-1 px-3">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-black">
                                                <Star className="h-3.5 w-3.5 fill-foreground" />
                                                {protocol.avg_rating}
                                            </div>
                                        </div>
                                        <CardTitle className="text-2xl font-black leading-tight tracking-tight group-hover:text-foreground/70 transition-colors line-clamp-2 min-h-[4rem]">
                                            {protocol.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-10 pb-10">
                                        <p className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed font-medium">
                                            {protocol.content}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="px-10 pb-10 flex items-center justify-between border-t border-muted/20 pt-8 mt-auto mx-10 px-0">
                                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                            <span className="flex items-center gap-2">
                                                <MessageSquare className="h-3 w-3" />
                                                {protocol.discussion_count}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Star className="h-3 w-3" />
                                                {protocol.ups}
                                            </span>
                                        </div>
                                        <div className="text-[10px] font-black pointer-events-none uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                                            Protocol Details
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-40 text-center border-4 border-dashed rounded-[3rem] border-muted/20">
                        <p className="text-sm font-black text-muted-foreground/20 uppercase tracking-[0.4em]">No results in registry</p>
                    </div>
                )}
            </div>

            {/* Pagination placeholder */}
            {pagination && pagination.last_page > 1 && (
                <div className="mt-20 flex justify-center gap-4">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="rounded-none border-2 font-black uppercase tracking-widest text-[10px]"
                    >
                        Prev
                    </Button>
                    <Button
                        variant="outline"
                        disabled={page === pagination.last_page}
                        onClick={() => setPage(p => p + 1)}
                        className="rounded-none border-2 font-black uppercase tracking-widest text-[10px]"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
