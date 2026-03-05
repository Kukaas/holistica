"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Voting } from "@/components/Voting";

interface ProtocolCardProps {
    protocol: any;
    showYear?: boolean;
}

export function ProtocolCard({ protocol, showYear = false }: ProtocolCardProps) {
    return (
        <Link href={`/protocols/${protocol.id}`}>
            <Card className="h-full rounded-none border-2 border-muted hover:border-foreground transition-all group bg-muted/5 shadow-none overflow-hidden hover:shadow-2xl hover:shadow-muted/20 flex flex-col">
                <CardHeader className="p-10 pb-4">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex flex-wrap gap-2">
                            {protocol.tags?.slice(0, 2).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="bg-foreground text-background rounded-none text-[9px] uppercase tracking-widest font-black py-1 px-3">
                                    {tag}
                                </Badge>
                            ))}
                            {(!protocol.tags || protocol.tags.length === 0) && (
                                <Badge variant="secondary" className="bg-foreground text-background rounded-none text-[9px] uppercase tracking-widest font-black py-1 px-3">
                                    General
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-black">
                            <Star className="h-3.5 w-3.5 fill-foreground" />
                            {protocol.avg_rating}
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black leading-tight tracking-tight group-hover:text-foreground/70 transition-colors line-clamp-2 min-h-[4rem]">
                        {protocol.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                    <p className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed font-medium">
                        {protocol.content}
                    </p>
                </CardContent>
                <CardFooter className="px-10 pb-10 flex flex-wrap items-center justify-between border-t border-muted/20 pt-8 mt-auto mx-10 px-0 gap-4">
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        <span className="flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" />
                            {protocol.threads_count || 0}
                        </span>
                        <div className="flex items-center" onClick={(e) => e.preventDefault()}>
                            <Voting
                                type="protocol"
                                id={protocol.id}
                                initialUps={protocol.ups || 0}
                                initialDowns={protocol.downs || 0}
                            />
                        </div>
                        <span className="flex items-center gap-2">
                            <Star className="h-3 w-3" />
                            {protocol.reviews_count || 0}
                        </span>
                        {showYear && (
                            <span>{new Date(protocol.created_at || Date.now()).getFullYear()}</span>
                        )}
                    </div>
                    <div className="text-[10px] font-black pointer-events-none uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Details →
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
