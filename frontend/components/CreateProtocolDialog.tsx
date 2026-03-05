"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { protocolService } from "@/lib/services/protocols";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CreateProtocolDialogProps {
    onSuccess?: () => void;
    trigger?: React.ReactNode;
    protocol?: {
        id: string;
        title: string;
        content: string;
        tags: string[];
    };
}

export function CreateProtocolDialog({ onSuccess, trigger, protocol }: CreateProtocolDialogProps) {
    const { user } = useAuth();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(protocol?.title || "");
    const [content, setContent] = useState(protocol?.content || "");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(protocol?.tags || []);
    const [loading, setLoading] = useState(false);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
            if (newTag && !tags.includes(newTag) && tags.length < 5) {
                setTags([...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Authentication Required", {
                description: "Log in to publish protocols.",
            });
            return;
        }

        if (!title.trim() || !content.trim()) {
            toast.error("Validation Error", {
                description: "Title and Content are required fields.",
            });
            return;
        }

        setLoading(true);
        try {
            let data;
            if (protocol) {
                // Update mode
                data = await protocolService.update(protocol.id, {
                    title,
                    content,
                    tags
                });
                toast.success("Protocol Updated", {
                    description: "Your changes have been saved.",
                });
            } else {
                // Create mode
                data = await protocolService.create({
                    title,
                    content,
                    tags
                });
                toast.success("Protocol Published", {
                    description: "Your protocol is now live in the registry.",
                });
            }

            if (!protocol) {
                setTitle("");
                setContent("");
                setTags([]);
            }

            setOpen(false);
            if (onSuccess) {
                onSuccess();
            } else if (!protocol) {
                router.push(`/protocols/${data.id}`);
            }
        } catch (error: any) {
            toast.error(protocol ? "Update Failed" : "Submission Failed", {
                description: error.response?.data?.message || "Something went wrong",
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="rounded-none h-14 px-8 font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                        + Submit Protocol
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-none border-4 border-foreground max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-3xl font-black uppercase tracking-tight">
                        {protocol ? "Edit Protocol" : "Publish Protocol"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest pt-2">
                        {protocol ? "Update your shared wellness routine" : "Share your wellness routine with the community"}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">Protocol Title</Label>
                        <Input
                            placeholder="e.g., Morning Deep Work Routine"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-14 rounded-none border-2 border-muted focus-visible:ring-0 focus-visible:border-foreground transition-all text-base font-bold"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">Detailed Content</Label>
                        <Textarea
                            placeholder="Describe the steps, dosages, warnings..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px] rounded-none border-2 border-muted focus-visible:ring-0 focus-visible:border-foreground transition-all text-sm font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                            Tags ({tags.length}/5)
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map(tag => (
                                <span key={tag} className="flex items-center gap-2 bg-foreground text-background px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input
                            placeholder="Type a tag and press Enter..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            disabled={tags.length >= 5}
                            className="h-12 rounded-none border-2 border-muted focus-visible:ring-0 focus-visible:border-foreground transition-all"
                        />
                        <div className="pt-2 flex flex-wrap gap-2">
                            <span className="text-[9px] font-black uppercase text-muted-foreground/60 mr-2 self-center">Suggested:</span>
                            {["biohacking", "longevity", "morning-routine", "supplements", "fitness"].map(suggested => (
                                <button
                                    key={suggested}
                                    type="button"
                                    onClick={() => !tags.includes(suggested) && tags.length < 5 && setTags([...tags, suggested])}
                                    className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    #{suggested}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading || !user}
                            className="w-full h-14 rounded-none font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                        >
                            {loading ? (protocol ? "Updating..." : "Publishing...") : (user ? (protocol ? "Save Changes" : "Publish Protocol") : "Authentication Required")}
                            {user && !loading && !protocol && <Plus className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
