"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { voteService } from "@/lib/services/votes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface VotingProps {
    type: "protocol" | "thread" | "comment";
    id: number;
    initialUps?: number;
    initialDowns?: number;
    userVote?: number | null; // 1, -1, or null
}

export function Voting({ type, id, initialUps = 0, initialDowns = 0, userVote = null }: VotingProps) {
    const { user } = useAuth();
    const [ups, setUps] = useState(initialUps);
    const [downs, setDowns] = useState(initialDowns);
    const [currentVote, setCurrentVote] = useState<number | null>(userVote);
    const [loading, setLoading] = useState(false);

    const handleVote = async (score: number) => {
        if (!user) {
            toast.error("Identity Required", {
                description: "You must be logged in to engage with protocols.",
            });
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const nextValue = currentVote === score ? 0 : score;

            await voteService.cast(
                String(id),
                type === "protocol" ? "App\\Models\\Protocol" :
                    type === "thread" ? "App\\Models\\Thread" : "App\\Models\\Comment",
                nextValue
            );

            if (currentVote === 1) setUps(prev => Math.max(0, prev - 1));
            if (currentVote === -1) setDowns(prev => Math.max(0, prev - 1));

            if (nextValue === 1) setUps(prev => prev + 1);
            if (nextValue === -1) setDowns(prev => prev + 1);

            setCurrentVote(nextValue === 0 ? null : nextValue);
        } catch (error) {
            console.error("Voting error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-0">
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-10 px-4 gap-3 text-[10px] rounded-none font-black uppercase tracking-widest transition-all border-y-2 border-l-2 border-muted",
                    currentVote === 1
                        ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                        : "hover:bg-muted hover:border-muted-foreground/30"
                )}
                onClick={() => handleVote(1)}
                disabled={loading}
            >
                <ThumbsUp className="h-3.5 w-3.5" />
                {ups}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-10 px-4 gap-3 text-[10px] rounded-none font-black uppercase tracking-widest transition-all border-2 border-muted",
                    currentVote === -1
                        ? "bg-foreground text-background border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                        : "hover:bg-muted hover:border-muted-foreground/30"
                )}
                onClick={() => handleVote(-1)}
                disabled={loading}
            >
                <ThumbsDown className="h-3.5 w-3.5" />
                {downs}
            </Button>
        </div>
    );
}
