"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft, User, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Voting } from "@/components/Voting";

export default function ThreadDetail() {
    const { id } = useParams();
    const [thread, setThread] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchThread() {
            try {
                const response = await api.get(`/threads/${id}`);
                setThread(response.data);
            } catch (error) {
                console.error("Error fetching thread:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchThread();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-24 animate-pulse">
                <div className="h-4 w-32 bg-muted rounded mb-12" />
                <div className="h-10 w-2/3 bg-muted rounded mb-6" />
                <div className="h-32 w-full bg-muted rounded" />
            </div>
        );
    }

    if (!thread) return <div className="container py-24 text-center">Thread not found.</div>;

    // Simple comment nesting helper
    const renderComments = (comments: any[], parentId: any = null, depth = 0) => {
        return comments
            .filter((c) => (parentId === null ? !c.parent_id : c.parent_id === parentId))
            .map((comment) => (
                <div key={comment.id} className={`space-y-4 ${depth > 0 ? "ml-8 border-l pl-6" : ""}`}>
                    <div className="flex gap-4">
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback className="text-[10px]">
                                {comment.user?.name?.slice(0, 2).toUpperCase() || "UN"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{comment.user?.name || "Anonymous"}</span>
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                            <div className="flex items-center gap-4 pt-2">
                                <Voting
                                    type="comment"
                                    id={comment.id}
                                    initialUps={comment.ups || 0}
                                    initialDowns={comment.downs || 0}
                                />
                                <button className="text-[10px] font-medium text-muted-foreground hover:underline">Reply</button>
                            </div>
                        </div>
                    </div>
                    {renderComments(comments, comment.id, depth + 1)}
                </div>
            ));
    };

    return (
        <div className="container max-w-3xl py-12 md:py-20">
            <Link
                href={`/protocols/${thread.protocol_id}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors w-fit"
            >
                <ArrowLeft className="h-4 w-4" /> Back to protocol
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 mb-16"
            >
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{thread.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border">
                            <AvatarFallback className="text-[8px]">
                                {thread.user?.name?.slice(0, 2).toUpperCase() || "HB"}
                            </AvatarFallback>
                        </Avatar>
                        <span>{thread.user?.name || "Host Builder"}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                        <Voting
                            type="thread"
                            id={thread.id}
                            initialUps={thread.ups || 0}
                            initialDowns={thread.downs || 0}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Discussion started in {thread.protocol?.title}</span>
                    </div>
                </div>
            </motion.div>

            <Separator className="mb-12 opacity-50" />

            <section className="space-y-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Comments ({thread.comments?.length || 0})
                    </h2>
                    <Button size="sm" className="rounded-full px-5 h-8 text-xs font-bold uppercase tracking-wider bg-foreground text-background">
                        Add Comment
                    </Button>
                </div>

                <div className="space-y-10">
                    {thread.comments?.length > 0 ? (
                        renderComments(thread.comments)
                    ) : (
                        <div className="text-center py-20 text-muted-foreground text-sm border border-dashed rounded-2xl">
                            No comments yet. Start the discussion.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
