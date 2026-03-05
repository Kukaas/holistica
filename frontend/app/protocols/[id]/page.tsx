"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowLeft, Clock, User, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Voting } from "@/components/Voting";

export default function ProtocolDetail() {
    const { id } = useParams();
    const [protocol, setProtocol] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProtocol() {
            try {
                const response = await api.get(`/protocols/${id}`);
                setProtocol(response.data);
            } catch (error) {
                console.error("Error fetching protocol:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProtocol();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-24 animate-pulse">
                <div className="h-8 w-48 bg-muted rounded mb-8" />
                <div className="h-12 w-3/4 bg-muted rounded mb-4" />
                <div className="h-64 w-full bg-muted rounded" />
            </div>
        );
    }

    if (!protocol) {
        return <div className="container py-24 text-center">Protocol not found.</div>;
    }

    return (
        <div className="container max-w-4xl py-12 md:py-20">
            <Link
                href="/"
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground mb-16 transition-colors w-fit"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to registry
            </Link>

            <motion.header
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 mb-20 border-l-4 border-foreground pl-10"
            >
                <div className="flex flex-wrap items-center gap-3">
                    {Array.isArray(protocol.tags) && protocol.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="bg-foreground text-background rounded-none text-[9px] uppercase tracking-widest font-black py-1 px-3">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-foreground">
                    {protocol.title}
                </h1>

                <div className="flex flex-wrap items-center gap-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Francisca</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(protocol.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-foreground text-foreground" />
                        <span className="text-foreground">{protocol.avg_rating} rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{protocol.discussion_count} discussions</span>
                    </div>
                    <div className="flex items-center py-2 h-10 px-6 border-2 border-muted hover:border-foreground transition-all">
                        <Voting
                            type="protocol"
                            id={protocol.id}
                            initialUps={protocol.ups || 0}
                            initialDowns={protocol.downs || 0}
                        />
                    </div>
                </div>
            </motion.header>

            <Separator className="mb-12 opacity-50" />

            <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose prose-zinc dark:prose-invert max-w-none mb-32"
            >
                <div className="text-xl leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap">
                    {protocol.content}
                </div>
            </motion.article>

            <Separator className="mb-12 opacity-50" />

            {/* Discussion Section Placeholder */}
            <section className="space-y-12">
                <div className="flex items-center justify-between border-b pb-8">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Engagement</span>
                        <h2 className="text-3xl font-black tracking-tight">Discussions</h2>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-none border-2 h-12 px-8 font-black uppercase tracking-widest text-[10px]">
                        Start a thread
                    </Button>
                </div>

                {protocol.threads?.length > 0 ? (
                    <div className="grid gap-6">
                        {protocol.threads.map((thread: any) => (
                            <Link key={thread.id} href={`/discussions/${thread.id}`}>
                                <div className="p-10 rounded-none border-2 border-muted hover:border-foreground transition-all bg-muted/5 group">
                                    <h3 className="text-xl font-black mb-4 group-hover:translate-x-1 transition-transform">{thread.title}</h3>
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                        <span className="flex items-center gap-2">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            {thread.comments_count || 0} comments
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5" />
                                            Active yesterday
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border-4 border-dashed rounded-[3rem] border-muted/20">
                        <p className="text-sm font-black text-muted-foreground/20 uppercase tracking-[0.4em]">No dialogue found</p>
                    </div>
                )}
            </section>
        </div>
    );
}
