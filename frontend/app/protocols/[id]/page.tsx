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
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors w-fit"
            >
                <ArrowLeft className="h-4 w-4" /> Back to protocols
            </Link>

            <motion.header
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 mb-12"
            >
                <div className="flex flex-wrap items-center gap-3">
                    {protocol.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="bg-muted text-[10px] uppercase tracking-wider font-bold">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                    {protocol.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Francisca</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(protocol.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 border-none" />
                        <span className="font-medium text-foreground">{protocol.avg_rating} rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{protocol.discussion_count} discussions</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <Voting
                        type="protocol"
                        id={protocol.id}
                        initialUps={protocol.ups || 0}
                        initialDowns={protocol.downs || 0}
                    />
                </div>
            </motion.header>

            <Separator className="mb-12 opacity-50" />

            <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose prose-zinc dark:prose-invert max-w-none mb-20"
            >
                <div className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {protocol.content}
                </div>
            </motion.article>

            <Separator className="mb-12 opacity-50" />

            {/* Discussion Section Placeholder */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">Discussions</h2>
                    <Button variant="outline" size="sm" className="rounded-full px-5">
                        Start a thread
                    </Button>
                </div>

                {protocol.threads?.length > 0 ? (
                    <div className="grid gap-4">
                        {protocol.threads.map((thread: any) => (
                            <Link key={thread.id} href={`/discussions/${thread.id}`}>
                                <div className="p-6 rounded-xl border border-muted hover:border-foreground transition-all bg-card/50">
                                    <h3 className="font-medium mb-2">{thread.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>{thread.comments_count || 0} comments</span>
                                        <span>•</span>
                                        <span>Last active yesterday</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed rounded-2xl border-muted">
                        <p className="text-sm text-muted-foreground">No discussions yet. Be the first to start the conversation.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
