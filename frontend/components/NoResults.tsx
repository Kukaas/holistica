"use client";

interface NoResultsProps {
    message: string;
}

export function NoResults({ message }: NoResultsProps) {
    return (
        <div className="py-32 text-center border-4 border-dashed rounded-[3rem] border-muted/20">
            <p className="text-xs font-black text-muted-foreground/20 uppercase tracking-[0.4em]">
                {message}
            </p>
        </div>
    );
}
