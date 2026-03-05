"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Voting } from "@/components/Voting";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CommentItem } from "@/components/CommentItem";
import { Pagination } from "@/components/Pagination";
import { NoResults } from "@/components/NoResults";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { useAuth } from "@/context/AuthContext";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { ThreadDetailSkeleton, CommentItemSkeleton } from "@/components/ItemSkeleton";

export default function ThreadDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [thread, setThread] = useState<any>(null);
    const [commentsData, setCommentsData] = useState<any>(null);
    const [commentsPage, setCommentsPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [showCommentDialog, setShowCommentDialog] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [submittingThread, setSubmittingThread] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function fetchThread() {
        try {
            const response = await api.get(`/threads/${id}`);
            setThread(response.data);
            setEditTitle(response.data.title);
            setEditContent(response.data.content || "");
            fetchComments(1);
        } catch (error) {
            console.error("Error fetching thread:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchComments(page: number) {
        setLoadingComments(true);
        try {
            const response = await api.get(`/threads/${id}/comments?page=${page}`);
            setCommentsData(response.data);
            setCommentsPage(page);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoadingComments(false);
        }
    }

    useEffect(() => {
        fetchThread();
    }, [id]);

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const toastId = toast.loading("Posting reply...");
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
            toast.success("Reply posted!", { id: toastId });
        } catch (error) {
            console.error("Error creating comment:", error);
            toast.error("Failed to post reply.", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const handleThreadEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittingThread(true);
        const toastId = toast.loading("Updating discussion...");
        try {
            await api.put(`/threads/${id}`, {
                title: editTitle,
                content: editContent
            });
            setThread({ ...thread, title: editTitle, content: editContent });
            setIsEditing(false);
            toast.success("Discussion updated!", { id: toastId });
        } catch (error) {
            console.error("Error updating thread:", error);
            toast.error("Failed to update discussion.", { id: toastId });
        } finally {
            setSubmittingThread(false);
        }
    };

    const handleThreadDelete = async () => {
        if (!confirm("Are you sure you want to delete this discussion?")) return;
        const toastId = toast.loading("Deleting discussion...");
        try {
            await api.delete(`/threads/${id}`);
            toast.success("Discussion deleted!", { id: toastId });
            router.push("/discussions");
        } catch (error) {
            console.error("Error deleting thread:", error);
            toast.error("Failed to delete discussion.", { id: toastId });
        }
    };

    if (loading) {
        return <ThreadDetailSkeleton />;
    }

    if (!thread) return <div className="container py-24 text-center">Thread not found.</div>;

    const isThreadOwner = user?.id === thread.user_id;

    return (
        <div className="container max-w-4xl py-10 md:py-16">
            <PageHeader
                backHref={`/protocols/${thread.protocol_id}`}
                backLabel="Back to protocol"
                title={thread.title}
                tags={thread.tags}
            >
                {isThreadOwner && (
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-none border-2 font-black uppercase tracking-widest text-[10px]">
                            <Edit className="w-3 h-3 mr-2" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleThreadDelete} className="rounded-none border-2 font-black uppercase tracking-widest text-[10px] text-red-500 hover:text-red-700 hover:bg-red-500/10 border-red-500/20">
                            <Trash className="w-3 h-3 mr-2" /> Delete
                        </Button>
                    </div>
                )}
            </PageHeader>

            <div className="space-y-12 mb-20">
                <div className="flex flex-col gap-8">
                    <div className="max-w-3xl border-y-2 border-muted/10 py-10 mb-6">
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed italic whitespace-pre-wrap">
                            "{thread.content}"
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-10 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                <AvatarFallback className="text-[10px] font-black rounded-none bg-muted/20">
                                    {thread.user?.name?.slice(0, 2).toUpperCase() || "HB"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-foreground">{thread.user?.name || "Host Builder"}</span>
                                <span className="text-[9px] text-muted-foreground/40 lowercase">Member since {new Date(thread.user?.created_at).getFullYear() || "2024"}</span>
                            </div>
                        </div>

                        <div className="h-8 w-[1px] bg-muted/20" />

                        <div className="flex items-center h-12">
                            <Voting
                                type="thread"
                                id={thread.id}
                                initialUps={thread.ups || 0}
                                initialDowns={thread.downs || 0}
                            />
                        </div>

                        <div className="h-8 w-[1px] bg-muted/20" />

                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4" />
                            <span>In {thread.protocol?.title} • {new Date(thread.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="space-y-16 pt-20 border-t-2 border-muted/20">
                <SectionHeader
                    title={`Comments (${thread.comments_count || 0})`}
                    subtitle="Dialogue"
                    icon={MessageSquare}
                >
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
                </SectionHeader>

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

                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogContent className="rounded-none border-4 border-foreground">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase tracking-widest">
                                Edit Discussion
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleThreadEdit} className="space-y-6 pt-4">
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="font-black uppercase text-[10px]">Topic</Label>
                                    <Input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="rounded-none border-2 font-bold h-12"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-black uppercase text-[10px]">Message</Label>
                                    <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="rounded-none border-2 font-medium min-h-[200px]"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={submittingThread}
                                    className="w-full rounded-none h-14 font-black uppercase tracking-widest bg-foreground text-background"
                                >
                                    {submittingThread ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="space-y-16">
                    {loadingComments ? (
                        <div className="space-y-6">
                            {Array(3).fill(0).map((_, i) => (
                                <CommentItemSkeleton key={i} />
                            ))}
                        </div>
                    ) : commentsData?.data?.length > 0 ? (
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
                                <Pagination
                                    currentPage={commentsPage}
                                    totalPages={commentsData.last_page}
                                    onPageChange={fetchComments}
                                />
                            )}
                        </>
                    ) : (
                        <NoResults message="No dialogue found" />
                    )}
                </div>
            </section>
        </div>
    );
}
