"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user?: {
        name: string;
    };
}

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="space-y-4">
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
    );
}
