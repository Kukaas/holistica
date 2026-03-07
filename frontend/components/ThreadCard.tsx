"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, User, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Voting } from "@/components/Voting";

interface ThreadCardProps {
    thread: any;
    showProtocol?: boolean;
    variant?: "card" | "simple";
}

export function ThreadCard({ thread, showProtocol = false, variant = "card" }: ThreadCardProps) {
    const cardContent = (
        <div className={variant === "card" ? "p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8" : "p-10"}>
            <div className="flex-1">
                <div className="flex gap-2 mb-4">
                    {Array.isArray(thread.tags) && thread.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[8px] font-black uppercase tracking-widest px-2 py-0 border-muted">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <h3 className="text-xl font-black mb-4 group-hover:translate-x-1 transition-transform">{thread.title}</h3>
                <p className={variant === "card" ? "text-sm text-muted-foreground mb-6 line-clamp-3 italic" : "text-xs text-muted-foreground mb-6 line-clamp-2 italic"}>
                    {thread.content}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                    <span className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {thread.user?.name || "Member"}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-muted/20" />
                    <span className="flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {thread.comments_count || 0} comments
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-muted/10" />
                    <div className="flex items-center" onClick={(e) => e.preventDefault()}>
                        <Voting
                            type="thread"
                            id={thread.id}
                            initialUps={thread.ups || 0}
                            initialDowns={thread.downs || 0}
                            userVote={thread.user_vote ?? null}
                        />
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-muted/10" />
                    <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(thread.created_at).toLocaleDateString()}
                    </span>
                </div>
                {showProtocol && thread.protocol && (
                    <div className="flex items-center gap-3 mt-6 text-[10px] font-bold text-muted-foreground/60 bg-muted/10 w-fit px-4 py-1.5 border border-muted/20">
                        <LinkIcon className="h-3 w-3" />
                        <span>Protocol:</span>
                        <span className="text-foreground">{thread.protocol.title}</span>
                    </div>
                )}
            </div>

            {variant === "card" && (
                <div className="flex items-center gap-10">
                    <div className="flex flex-col items-center">
                        <Badge variant="outline" className="border-2 rounded-none text-[10px] uppercase font-black px-6 py-2 group-hover:bg-foreground group-hover:text-background transition-colors h-10 flex items-center justify-center whitespace-nowrap">
                            View Thread
                        </Badge>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <Link href={`/discussions/${thread.id}`}>
            {variant === "card" ? (
                <Card className="rounded-none border-2 border-muted hover:border-foreground transition-all group bg-muted/5 shadow-none hover:bg-muted/10">
                    {cardContent}
                </Card>
            ) : (
                <div className="rounded-none border-2 border-muted hover:border-foreground transition-all bg-muted/5 group shadow-[0px_0px_0px_0px_rgba(0,0,0,0)] hover:shadow-2xl hover:shadow-muted/20">
                    {cardContent}
                </div>
            )}
        </Link>
    );
}
