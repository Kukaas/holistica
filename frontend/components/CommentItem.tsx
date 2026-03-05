"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Voting } from "@/components/Voting";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash, Edit } from "lucide-react";
import { commentService } from "@/lib/services/comments";
import { toast } from "sonner";

interface CommentItemProps {
    comment: any;
    allComments: any[];
    depth?: number;
    onReply: (parentId: string) => void;
    onUpdate: () => void;
}

export function CommentItem({ comment, allComments, depth = 0, onReply, onUpdate }: CommentItemProps) {
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [submitting, setSubmitting] = useState(false);

    const replies = comment.replies || allComments.filter((c) => c.parent_id === comment.id);
    const hasReplies = replies.length > 0;
    const isOwner = user?.id === comment.user_id;

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const toastId = toast.loading("Updating comment...");
        try {
            await commentService.update(comment.id, { content: editContent });
            setIsEditing(false);
            onUpdate();
            toast.success("Comment updated successfully!", { id: toastId });
        } catch (error) {
            console.error("Error updating comment:", error);
            toast.error("Failed to update comment.", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        const toastId = toast.loading("Deleting comment...");
        try {
            await commentService.delete(comment.id);
            onUpdate();
            toast.success("Comment deleted successfully!", { id: toastId });
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment.", { id: toastId });
        }
    };

    return (
        <div className="space-y-6">
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
                        <p className="text-[15px] font-medium text-foreground/80 leading-relaxed max-w-2xl whitespace-pre-wrap">{comment.content}</p>
                        <div className="flex items-center gap-6 pt-2 animate-in fade-in duration-300">
                            <div className="flex items-center py-1 px-4 border-2 border-muted hover:border-foreground transition-all">
                                <Voting
                                    type="comment"
                                    id={comment.id}
                                    initialUps={comment.ups || 0}
                                    initialDowns={comment.downs || 0}
                                />
                            </div>
                            <button
                                onClick={() => onReply(comment.id)}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Reply
                            </button>

                            {isOwner && (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                    >
                                        <Edit className="w-3 h-3" /> Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                                    >
                                        <Trash className="w-3 h-3" /> Delete
                                    </button>
                                </>
                            )}

                            {hasReplies && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground hover:opacity-70 transition-opacity flex items-center gap-2"
                                >
                                    {isExpanded ? "Hide" : "Show"} Replies ({replies.length})
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogContent className="rounded-none border-4 border-foreground">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase tracking-widest">
                                Edit Comment
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <Label className="font-black uppercase text-[10px]">Your Message</Label>
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="rounded-none border-2 min-h-[120px]"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={submitting} className="w-full rounded-none h-14 font-black uppercase tracking-widest bg-foreground text-background">
                                {submitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {isExpanded && hasReplies && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {replies.map((reply: any) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                allComments={allComments}
                                depth={depth + 1}
                                onReply={onReply}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
