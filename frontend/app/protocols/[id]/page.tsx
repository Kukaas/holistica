"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { protocolService } from "@/lib/services/protocols";
import { threadService } from "@/lib/services/threads";
import { reviewService } from "@/lib/services/reviews";
import { CreateProtocolDialog } from "@/components/CreateProtocolDialog";
import { Star, MessageSquare, Clock, User, Edit, Trash } from "lucide-react";
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
import { ThreadCard } from "@/components/ThreadCard";
import { ReviewCard } from "@/components/ReviewCard";
import { Pagination } from "@/components/Pagination";
import { NoResults } from "@/components/NoResults";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";

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
            const data = await protocolService.getById(id as string);
            setProtocol(data);
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
            const data = await protocolService.getThreads(id as string, page);
            setThreadsData(data);
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
            const data = await protocolService.getReviews(id as string, page);
            setReviewsData(data);
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
            await threadService.create({
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
            await reviewService.create({
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
            await protocolService.delete(id as string);

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
            await protocolService.restore(id as string);
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
            <PageHeader
                backHref="/protocols"
                backLabel="Back to registry"
                title={protocol.title}
                tags={protocol.tags}
            >
                {isAuthor && (
                    <div className="flex gap-4">
                        <CreateProtocolDialog
                            protocol={protocol}
                            onSuccess={fetchProtocol}
                            trigger={
                                <Button variant="outline" size="sm" className="rounded-none border-2 font-black uppercase tracking-widest text-[10px]">
                                    <Edit className="w-3 h-3 mr-2" /> Edit
                                </Button>
                            }
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="rounded-none border-2 font-black uppercase tracking-widest text-[10px] text-red-500 hover:text-red-700 hover:bg-red-500/10 border-red-500/20"
                        >
                            <Trash className="w-3 h-3 mr-2" /> {isDeleting ? "Trashing..." : "Delete"}
                        </Button>
                    </div>
                )}
            </PageHeader>

            <div className="space-y-12 mb-20">
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
                            userVote={protocol.user_vote ?? null}
                        />
                    </div>
                </div>
            </div>

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

            <Separator className="mb-12 opacity-50" />

            <section className="space-y-12 mb-32">
                <SectionHeader
                    title="Dialogue"
                    subtitle="Threads"
                    icon={MessageSquare}
                >
                    <div className="flex items-center gap-4">
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
                </SectionHeader>

                {loadingThreads ? (
                    <div className="grid gap-6">
                        {Array(3).fill(0).map((_, i) => (
                            <ThreadItemSkeleton key={i} />
                        ))}
                    </div>
                ) : threadsData?.data?.length > 0 ? (
                    <div className="grid gap-6">
                        {threadsData.data.map((thread: any) => (
                            <ThreadCard key={thread.id} thread={thread} variant="simple" />
                        ))}

                        <Pagination
                            currentPage={threadsPage}
                            totalPages={threadsData.last_page}
                            onPageChange={fetchThreads}
                        />
                    </div>
                ) : (
                    <NoResults message="No dialogue found" />
                )}
            </section>

            <section className="space-y-12">
                <SectionHeader
                    title="Community Feedback"
                    subtitle="Assessment"
                    icon={Star}
                >
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
                    </div>
                </SectionHeader>

                {loadingReviews ? (
                    <div className="grid gap-10">
                        {Array(3).fill(0).map((_, i) => (
                            <ReviewItemSkeleton key={i} />
                        ))}
                    </div>
                ) : reviewsData?.data?.length > 0 ? (
                    <div className="grid gap-10">
                        {reviewsData.data.map((review: any) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}

                        <Pagination
                            currentPage={reviewsPage}
                            totalPages={reviewsData.last_page}
                            onPageChange={fetchReviews}
                        />
                    </div>
                ) : (
                    <NoResults message="No assessments recorded" />
                )}
            </section>
        </div>
    );
}
