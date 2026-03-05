"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
    backHref: string;
    backLabel: string;
    title: string;
    tags?: string[];
    children?: React.ReactNode; // For extra actions like Edit/Delete buttons
}

export function PageHeader({ backHref, backLabel, title, tags, children }: PageHeaderProps) {
    return (
        <>
            <Link
                href={backHref}
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground mb-16 transition-colors w-fit"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> {backLabel}
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 mb-20 border-l-4 border-foreground pl-10"
            >
                <div className="flex flex-col gap-8">
                    <div className="flex items-start justify-between gap-8">
                        <div className="flex-1">
                            {tags && tags.length > 0 && (
                                <div className="flex gap-2 mb-6">
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 border-muted">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] text-foreground mb-10">
                                {title}
                            </h1>
                        </div>
                        {children}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
