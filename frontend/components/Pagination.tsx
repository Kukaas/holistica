"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    center?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, center = false }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={`mt-12 flex ${center ? "justify-center" : "justify-start"} gap-4`}>
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => {
                    onPageChange(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-none border-2 font-black text-[10px] uppercase tracking-widest px-8 h-12"
            >
                Prev
            </Button>
            <div className="flex items-center px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                Page {currentPage} of {totalPages}
            </div>
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => {
                    onPageChange(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-none border-2 font-black text-[10px] uppercase tracking-widest px-8 h-12"
            >
                Next
            </Button>
        </div>
    );
}
