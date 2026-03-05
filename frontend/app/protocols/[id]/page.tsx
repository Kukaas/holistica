"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { CreateProtocolDialog } from "@/components/CreateProtocolDialog";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowLeft, Clock, User, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Voting } from "@/components/Voting";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ThreadItemSkeleton, ReviewItemSkeleton } from "@/components/ItemSkeleton";

export default function ProtocolDetail() {
    const { user } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const [protocol, setProtocol] = useState<any>(null);
    const [threadsData, setThreadsData] = useState<any>(null);
    const [reviewsData, setReviewsData] = useState<any>(null);
    const [threadsPage, setThreadsPage] = useState(1);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [threadTitle, setThreadTitle] = useState("");
    const [threadContent, setThreadContent] = useState("");
    const [threadTags, setThreadTags] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [showThreadDialog, setShowThreadDialog] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function fetchProtocol() {
        try {
            const response = await api.get(`/protocols/${id}`);
            setProtocol(response.data);
            fetchThreads(1);
            fetchReviews(1);
        } catch (error) {
            console.error("Error fetching protocol:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchThreads(page: number) {
        setLoadingThreads(true);
        try {
            const response = await api.get(`/protocols/${id}/threads?page=${page}`);
            setThreadsData(response.data);
            setThreadsPage(page);
        } catch (error) {
            console.error("Error fetching threads:", error);
        } finally {
            setLoadingThreads(false);
        }
    }

    async function fetchReviews(page: number) {
        setLoadingReviews(true);
        try {
            const response = await api.get(`/protocols/${id}/reviews?page=${page}`);
            setReviewsData(response.data);
            setReviewsPage(page);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoadingReviews(false);
        }
    }

    useEffect(() => {
        fetchProtocol();
    }, [id]);

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Identity Required", {
                description: "Log in to start new discussions.",
            });
            return;
        }
        setSubmitting(true);
        try {
            await api.post("/threads", {
                protocol_id: id,
                title: threadTitle,
                content: threadContent,
                tags: threadTags.split(",").map(t => t.trim()).filter(t => t !== ""),
            });
            setThreadTitle("");
            setThreadContent("");
            setThreadTags("");
            setShowThreadDialog(false);
            fetchThreads(1); // Refresh threads
            fetchProtocol(); // Refresh count
        } catch (error) {
            console.error("Error creating thread:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Identity Required", {
                description: "Log in to submit protocol assessments.",
            });
            return;
        }
        setSubmitting(true);
        try {
            await api.post("/reviews", {
                protocol_id: id,
                rating: reviewRating,
                comment: reviewComment,
            });
            setReviewComment("");
            setShowReviewDialog(false);
            fetchReviews(1); // Refresh reviews
            fetchProtocol(); // Refresh rating/count
        } catch (error) {
            console.error("Error creating review:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Trash Protocol? This will move the protocol and all its discussions to the trash. You can undo this for 10 seconds.")) {
            return;
        }

        setIsDeleting(true);
        try {
            await api.delete(`/protocols/${id}`);

            let timeLeft = 10;
            const toastId = toast.success("Protocol trashed", {
                description: `Recoverable for ${timeLeft} seconds.`,
                action: {
                    label: "Undo",
                    onClick: () => handleRestore(),
                },
                duration: 10000,
            });

            const timer = setInterval(() => {
                timeLeft -= 1;
                if (timeLeft > 0) {
                    toast.success("Protocol trashed", {
                        id: toastId,
                        description: `Recoverable for ${timeLeft} seconds.`,
                        action: {
                            label: "Undo",
                            onClick: () => handleRestore(),
                        },
                    });
                } else {
                    clearInterval(timer);
                    toast.dismiss(toastId);
                }
            }, 1000);

            router.push("/protocols");
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRestore = async () => {
        try {
            await api.post(`/protocols/${id}/restore`);
            toast.success("Protocol restored");
            fetchProtocol();
        } catch (error) {
            toast.error("Restoration failed");
        }
    };

    if (loading) {
        return (
            <div className="container py-12 animate-pulse">
                <div className="h-8 w-48 bg-muted rounded mb-8" />
                <div className="h-12 w-3/4 bg-muted rounded mb-4" />
                <div className="h-64 w-full bg-muted rounded" />
            </div>
        );
    }

    if (!protocol) {
        return <div className="container py-24 text-center">Protocol not found.</div>;
    }

    const isAuthor = user?.id === protocol.author_id;

    return (
        <div className="container max-w-4xl py-8 md:py-12">
            <div className="flex items-center justify-between mb-16">
                <Link
                    href="/protocols"
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to registry
                </Link>

                {isAuthor && (
                    <div className="flex items-center gap-4">
                        <CreateProtocolDialog
                            protocol={protocol}
                            onSuccess={fetchProtocol}
                            trigger={
                                <Button variant="outline" size="sm" className="rounded-none h-10 px-6 font-black uppercase tracking-widest text-[9px] border-2">
                                    Edit
                                </Button>
                            }
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="rounded-none h-10 px-6 font-black uppercase tracking-widest text-[9px] border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
                        >
                            {isDeleting ? "Trashing..." : "Delete"}
                        </Button>
                    </div>
                )}
            </div>

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
                        <span>{protocol.threads_count || 0} discussions</span>
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
                    <div className="flex items-center gap-4">
                        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-none border-2 h-12 px-8 font-black uppercase tracking-widest text-[10px]">
                                    Rate Protocol
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-none border-4 border-foreground">
                                <DialogHeader>
                                    <DialogTitle className="font-black uppercase tracking-widest">Protocol Assessment</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateReview} className="space-y-6 pt-4">
                                    <div className="space-y-4">
                                        <Label className="font-black uppercase text-[10px]">Protocol Grade</Label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    className="group transition-all active:scale-90"
                                                >
                                                    <Star
                                                        className={cn(
                                                            "h-10 w-10 transition-colors",
                                                            star <= reviewRating
                                                                ? "fill-foreground text-foreground"
                                                                : "text-muted hover:text-foreground/40"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Selecting {reviewRating} out of 5 stars
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-black uppercase text-[10px]">Feedback (Required)</Label>
                                        <span className="text-[8px] text-muted-foreground block -mt-1 mb-1">Detailed experience helps others</span>
                                        <Textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Your experience..."
                                            className="rounded-none border-2 min-h-[100px]"
                                            required
                                            minLength={3}
                                        />
                                    </div>
                                    <Button type="submit" disabled={submitting} className="w-full rounded-none h-14 font-black uppercase tracking-widest bg-foreground text-background">
                                        {submitting ? "Processing..." : "Submit Review"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={showThreadDialog} onOpenChange={setShowThreadDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="rounded-none border-2 h-12 px-8 font-black uppercase tracking-widest text-[10px] bg-foreground text-background hover:bg-foreground/90">
                                    Start a thread
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-none border-4 border-foreground">
                                <DialogHeader>
                                    <DialogTitle className="font-black uppercase tracking-widest">Open Discussion</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateThread} className="space-y-6 pt-4">
                                    <div className="space-y-2">
                                        <Label className="font-black uppercase text-[10px]">Topic</Label>
                                        <Input
                                            value={threadTitle}
                                            onChange={(e) => setThreadTitle(e.target.value)}
                                            placeholder="What would you like to discuss?"
                                            className="rounded-none border-2 h-12 font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-black uppercase text-[10px]">Message</Label>
                                        <Textarea
                                            value={threadContent}
                                            onChange={(e) => setThreadContent(e.target.value)}
                                            placeholder="Elaborate your thoughts..."
                                            className="rounded-none border-2 min-h-[120px]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="font-black uppercase text-[10px]">Tags (Comma separated)</Label>
                                        <Input
                                            value={threadTags}
                                            onChange={(e) => setThreadTags(e.target.value)}
                                            placeholder="e.g. results, dosage, side-effects"
                                            className="rounded-none border-2 h-12 font-bold"
                                        />
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-[9px] font-black uppercase text-muted-foreground/40 mr-1 self-center">Sample tags:</span>
                                            {['dosage', 'results', 'side-effects', 'synergy', 'timing', 'brand', 'stacking', 'safety'].map(tag => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = threadTags.split(',').map(t => t.trim()).filter(t => t !== "");
                                                        if (!current.includes(tag)) {
                                                            setThreadTags(current.concat(tag).join(', '));
                                                        }
                                                    }}
                                                    className="text-[9px] font-black uppercase tracking-widest px-2 py-1 border border-muted hover:border-foreground hover:bg-muted/10 transition-all"
                                                >
                                                    +{tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={submitting} className="w-full rounded-none h-14 font-black uppercase tracking-widest bg-foreground text-background">
                                        {submitting ? "Starting..." : "Create Thread"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {loadingThreads ? (
                    <div className="grid gap-6">
                        {Array(3).fill(0).map((_, i) => (
                            <ThreadItemSkeleton key={i} />
                        ))}
                    </div>
                ) : threadsData?.data?.length > 0 ? (
                    <div className="grid gap-6">
                        {threadsData.data.map((thread: any) => (
                            <Link key={thread.id} href={`/discussions/${thread.id}`}>
                                <div className="p-10 rounded-none border-2 border-muted hover:border-foreground transition-all bg-muted/5 group shadow-[0px_0px_0px_0px_rgba(0,0,0,0)] hover:shadow-2xl hover:shadow-muted/20">
                                    <div className="flex gap-2 mb-4">
                                        {Array.isArray(thread.tags) && thread.tags.map((tag: string) => (
                                            <Badge key={tag} variant="outline" className="text-[8px] font-black uppercase tracking-widest px-2 py-0 border-muted">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-black mb-4 group-hover:translate-x-1 transition-transform">{thread.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-6 line-clamp-2 italic">
                                        {thread.content}
                                    </p>
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                        <span className="flex items-center gap-2">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            {thread.comments_count || 0} comments
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5" />
                                            {new Date(thread.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {threadsData.last_page > 1 && (
                            <div className="flex justify-start gap-4 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={threadsPage === 1}
                                    onClick={() => fetchThreads(threadsPage - 1)}
                                    className="rounded-none border-2 font-black text-[10px] uppercase tracking-widest px-6"
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={threadsPage === threadsData.last_page}
                                    onClick={() => fetchThreads(threadsPage + 1)}
                                    className="rounded-none border-2 font-black text-[10px] uppercase tracking-widest px-6"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-24 text-center border-4 border-dashed rounded-[3rem] border-muted/20">
                        <p className="text-sm font-black text-muted-foreground/20 uppercase tracking-[0.4em]">No dialogue found</p>
                    </div>
                )}
            </section>

            {/* Reviews Section */}
            <section className="space-y-12">
                <div className="flex items-center justify-between border-b pb-8">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Assessment</span>
                        <h2 className="text-3xl font-black tracking-tight">Community Feedback</h2>
                    </div>
                </div>

                {loadingReviews ? (
                    <div className="grid gap-10">
                        {Array(3).fill(0).map((_, i) => (
                            <ReviewItemSkeleton key={i} />
                        ))}
                    </div>
                ) : reviewsData?.data?.length > 0 ? (
                    <div className="grid gap-10">
                        {reviewsData.data.map((review: any) => (
                            <div key={review.id} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={cn(
                                                        "h-3.5 w-3.5",
                                                        s <= review.rating ? "fill-foreground text-foreground" : "text-muted"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                            {review.user?.name || "Anonymous"}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-[15px] font-medium text-foreground/70 leading-relaxed italic border-l-2 border-muted pl-6">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}

                        {reviewsData.last_page > 1 && (
                            <div className="flex justify-start gap-4 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={reviewsPage === 1}
                                    onClick={() => fetchReviews(reviewsPage - 1)}
                                    className="rounded-none border-2 font-black text-[10px] uppercase tracking-widest px-6"
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={reviewsPage === reviewsData.last_page}
                                    onClick={() => fetchReviews(reviewsPage + 1)}
                                    className="rounded-none border-2 font-black text-[10px] uppercase tracking-widest px-6"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-24 text-center border-4 border-dashed rounded-[3rem] border-muted/20">
                        <p className="text-sm font-black text-muted-foreground/20 uppercase tracking-[0.4em]">No assessments recorded</p>
                    </div>
                )}
            </section>
        </div>
    );
}
