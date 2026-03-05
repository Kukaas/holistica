"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface VotingProps {
    type: "protocol" | "thread" | "comment";
    id: number;
    initialUps?: number;
    initialDowns?: number;
    userVote?: number | null; // 1, -1, or null
}

export function Voting({ type, id, initialUps = 0, initialDowns = 0, userVote = null }: VotingProps) {
    const [ups, setUps] = useState(initialUps);
    const [downs, setDowns] = useState(initialDowns);
    const [currentVote, setCurrentVote] = useState<number | null>(userVote);
    const [loading, setLoading] = useState(false);

    const handleVote = async (score: number) => {
        if (loading) return;
        setLoading(true);

        try {
            // Toggle if clicking the same button
            const finalScore = currentVote === score ? 0 : score;

            await api.post("/votes", {
                votable_id: id,
                votable_type: type === "protocol" ? "App\\Models\\Protocol" :
                    type === "thread" ? "App\\Models\\Thread" : "App\\Models\\Comment",
                score: finalScore
            });

            // Optimistic update
            if (currentVote === 1) setUps(prev => prev - 1);
            if (currentVote === -1) setDowns(prev => prev - 1);

            if (finalScore === 1) setUps(prev => prev + 1);
            if (finalScore === -1) setDowns(prev => prev + 1);

            setCurrentVote(finalScore === 0 ? null : finalScore);
        } catch (error) {
            console.error("Voting error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-7 px-2 gap-1.5 text-[10px] rounded-full",
                    currentVote === 1 ? "bg-black text-white hover:bg-black/90" : "hover:bg-muted"
                )}
                onClick={() => handleVote(1)}
                disabled={loading}
            >
                <ThumbsUp className="h-3 w-3" />
                {ups}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-7 px-2 gap-1.5 text-[10px] rounded-full",
                    currentVote === -1 ? "bg-black text-white hover:bg-black/90" : "hover:bg-muted"
                )}
                onClick={() => handleVote(-1)}
                disabled={loading}
            >
                <ThumbsDown className="h-3 w-3" />
                {downs}
            </Button>
        </div>
    );
}
