"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft, User, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Voting } from "@/components/Voting";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ThreadDetail() {
    const { id } = useParams();
    const [thread, setThread] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [showCommentDialog, setShowCommentDialog] = useState(false);

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

    useEffect(() => {
        fetchThread();
    }, [id]);

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/comments", {
                thread_id: id,
                parent_id: parentId,
                content: commentContent,
            });
            setCommentContent("");
            setParentId(null);
            setShowCommentDialog(false);
            fetchThread();
        } catch (error) {
            console.error("Error creating comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

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
    const renderComments = (comments: any[], pId: any = null, depth = 0) => {
        return comments
            .filter((c) => (pId === null ? !c.parent_id : c.parent_id === pId))
            .map((comment) => (
                <div key={comment.id} className="space-y-6">
                    <div className={cn("space-y-6", depth > 0 ? "ml-8 border-l-2 border-muted pl-10" : "border-b border-muted/20 pb-12 pt-6")}>
                        <div className="flex gap-6">
                            <Avatar className="h-10 w-10 border-2 border-muted rounded-none">
                                <AvatarFallback className="text-[10px] font-black rounded-none">
                                    {comment.user?.name?.slice(0, 2).toUpperCase() || "UN"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-black uppercase tracking-widest text-foreground">{comment.user?.name || "Anonymous"}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground/50">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-[15px] font-medium text-foreground/80 leading-relaxed max-w-2xl">{comment.content}</p>
                                <div className="flex items-center gap-6 pt-2">
                                    <div className="flex items-center py-1 px-4 border-2 border-muted hover:border-foreground transition-all">
                                        <Voting
                                            type="comment"
                                            id={comment.id}
                                            initialUps={comment.ups || 0}
                                            initialDowns={comment.downs || 0}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setParentId(comment.id);
                                            setShowCommentDialog(true);
                                        }}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                        {renderComments(comments, comment.id, depth + 1)}
                    </div>
                </div>
            ));
    };

    return (
        <div className="container max-w-4xl py-24 md:py-32">
            <Link
                href={`/protocols/${thread.protocol_id}`}
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground mb-16 transition-colors w-fit"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to protocol
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 mb-20 border-l-4 border-foreground pl-10"
            >
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-foreground">{thread.title}</h1>
                <div className="flex flex-wrap items-center gap-10 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <AvatarFallback className="text-[10px] font-black rounded-none bg-muted/20">
                                {thread.user?.name?.slice(0, 2).toUpperCase() || "HB"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground">{thread.user?.name || "Host Builder"}</span>
                    </div>

                    <div className="flex items-center py-2 px-6 border-2 border-muted hover:border-foreground transition-all h-12">
                        <Voting
                            type="thread"
                            id={thread.id}
                            initialUps={thread.ups || 0}
                            initialDowns={thread.downs || 0}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4" />
                        <span>Discussion in {thread.protocol?.title}</span>
                    </div>
                </div>
            </motion.div>

            <section className="space-y-16 pt-20 border-t-2 border-muted/20">
                <div className="flex items-center justify-between border-b-2 border-muted pb-8">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Dialogue</span>
                        <h2 className="text-3xl font-black flex items-center gap-3">
                            <MessageSquare className="h-6 w-6" />
                            Comments ({thread.comments?.length || 0})
                        </h2>
                    </div>
                    <Button
                        onClick={() => {
                            setParentId(null);
                            setShowCommentDialog(true);
                        }}
                        size="sm"
                        className="rounded-none border-2 h-14 px-10 font-black uppercase tracking-widest text-[11px] bg-foreground text-background hover:bg-foreground/90 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
                    >
                        Add Comment
                    </Button>
                </div>

                <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
                    <DialogContent className="rounded-none border-4 border-foreground">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase tracking-widest">
                                {parentId ? "Post Reply" : "Join Dialogue"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateComment} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label className="font-black uppercase text-[10px]">Your Message</Label>
                                <Textarea
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    placeholder="Add to the conversation..."
                                    className="rounded-none border-2 min-h-[120px]"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={submitting} className="w-full rounded-none h-14 font-black uppercase tracking-widest bg-foreground text-background">
                                {submitting ? "Sending..." : "Post Comment"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="space-y-16">
                    {thread.comments?.length > 0 ? (
                        renderComments(thread.comments)
                    ) : (
                        <div className="py-32 text-center border-4 border-dashed rounded-[3rem] border-muted/20">
                            <p className="text-xs font-black text-muted-foreground/20 uppercase tracking-[0.4em]">No dialogue found</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
