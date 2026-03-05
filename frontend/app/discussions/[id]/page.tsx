"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { CommentItem } from "@/components/CommentItem";
import { useAuth } from "@/context/AuthContext";
import { Edit, Trash } from "lucide-react";

export default function ThreadDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [thread, setThread] = useState<any>(null);
    const [commentsData, setCommentsData] = useState<any>(null);
    const [commentsPage, setCommentsPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [showCommentDialog, setShowCommentDialog] = useState(false);

    const [isEditingThread, setIsEditingThread] = useState(false);
    const [editThreadTitle, setEditThreadTitle] = useState("");
    const [submittingThread, setSubmittingThread] = useState(false);

    async function fetchThread() {
        try {
            const response = await api.get(`/threads/${id}`);
            setThread(response.data);
            setEditThreadTitle(response.data.title);
            fetchComments(1);
        } catch (error) {
            console.error("Error fetching thread:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchComments(page: number) {
        try {
            const response = await api.get(`/threads/${id}/comments?page=${page}`);
            setCommentsData(response.data);
            setCommentsPage(page);
        } catch (error) {
            console.error("Error fetching comments:", error);
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
            fetchComments(1); // Refresh first page
            fetchThread(); // Refresh thread metadata (like count)
        } catch (error) {
            console.error("Error creating comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleThreadEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingThread(true);
        try {
            await api.put(`/threads/${id}`, { title: editThreadTitle });
            setIsEditingThread(false);
            fetchThread();
        } catch (error) {
            console.error("Error updating thread:", error);
        } finally {
            setSubmittingThread(false);
        }
    };

    const handleThreadDelete = async () => {
        if (!confirm("Are you sure you want to delete this discussion?")) return;
        try {
            await api.delete(`/threads/${id}`);
            router.push("/discussions");
        } catch (error) {
            console.error("Error deleting thread:", error);
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

    const isThreadOwner = user?.id === thread.user_id;

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
                <div className="flex items-start justify-between gap-8">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-foreground flex-1">{thread.title}</h1>
                    {isThreadOwner && (
                        <div className="flex gap-4">
                            <Button variant="outline" size="sm" onClick={() => setIsEditingThread(true)} className="rounded-none border-2 font-black uppercase tracking-widest text-[10px]">
                                <Edit className="w-3 h-3 mr-2" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleThreadDelete} className="rounded-none border-2 font-black uppercase tracking-widest text-[10px] text-red-500 hover:text-red-700 hover:bg-red-500/10 border-red-500/20">
                                <Trash className="w-3 h-3 mr-2" /> Delete
                            </Button>
                        </div>
                    )}
                </div>
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

                <Dialog open={isEditingThread} onOpenChange={setIsEditingThread}>
                    <DialogContent className="rounded-none border-4 border-foreground">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase tracking-widest">
                                Edit Discussion Title
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleThreadEdit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label className="font-black uppercase text-[10px]">Title</Label>
                                <Input
                                    value={editThreadTitle}
                                    onChange={(e) => setEditThreadTitle(e.target.value)}
                                    className="rounded-none border-2 h-14 font-bold"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={submittingThread} className="w-full rounded-none h-14 font-black uppercase tracking-widest bg-foreground text-background">
                                {submittingThread ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="space-y-16">
                    {commentsData?.data?.length > 0 ? (
                        <>
                            {commentsData.data.map((comment: any) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    allComments={commentsData.data}
                                    depth={0}
                                    onReply={(id) => {
                                        setParentId(id);
                                        setShowCommentDialog(true);
                                    }}
                                    onUpdate={() => {
                                        fetchComments(1);
                                        fetchThread();
                                    }}
                                />
                            ))}

                            {commentsData.last_page > 1 && (
                                <div className="flex justify-start gap-4 mt-12">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={commentsPage === 1}
                                        onClick={() => fetchComments(commentsPage - 1)}
                                        className="rounded-none border-2 font-black text-[10px] uppercase tracking-widest px-8 h-12"
                                    >
                                        Prev
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={commentsPage === commentsData.last_page}
                                        onClick={() => fetchComments(commentsPage + 1)}
                                        className="rounded-none border-2 font-black text-[10px] uppercase tracking-widest px-8 h-12"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
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
