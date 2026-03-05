import { Skeleton } from "@/components/ui/skeleton";

export function DiscussionListSkeleton() {
    return (
        <div className="space-y-6 w-full">
            {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-32 rounded-none bg-muted/20 animate-pulse border-2 border-muted flex flex-col md:flex-row p-8 md:p-10 justify-between gap-8">
                    <div className="space-y-4 flex-1">
                        <Skeleton className="h-4 w-40 rounded-none bg-muted" />
                        <Skeleton className="h-8 w-3/4 rounded-none bg-muted" />
                        <Skeleton className="h-6 w-32 rounded-none bg-muted" />
                    </div>
                    <div className="flex items-center gap-10 opacity-50">
                        <div className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-6 w-6 rounded-none bg-muted" />
                            <Skeleton className="h-3 w-16 rounded-none bg-muted" />
                        </div>
                        <Skeleton className="h-10 w-32 rounded-none bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ThreadDetailSkeleton() {
    return (
        <div className="container max-w-4xl py-24 md:py-32 w-full animate-pulse">
            <Skeleton className="h-4 w-32 bg-muted rounded-none mb-16" />
            <div className="space-y-8 mb-20 border-l-4 border-muted pl-10">
                <Skeleton className="h-16 w-3/4 bg-muted rounded-none" />
                <div className="flex gap-10">
                    <Skeleton className="h-10 w-32 bg-muted rounded-none" />
                    <Skeleton className="h-10 w-24 bg-muted rounded-none" />
                    <Skeleton className="h-10 w-40 bg-muted rounded-none" />
                </div>
            </div>
            <div className="space-y-16 pt-20 border-t-2 border-muted/20">
                <div className="flex justify-between pb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-muted rounded-none" />
                        <Skeleton className="h-10 w-48 bg-muted rounded-none" />
                    </div>
                    <Skeleton className="h-14 w-40 bg-muted rounded-none" />
                </div>
                <div className="space-y-6">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex gap-6 border-b border-muted/20 pb-12 pt-6">
                            <Skeleton className="h-10 w-10 bg-muted rounded-none" />
                            <div className="flex-1 space-y-4">
                                <div className="flex gap-4">
                                    <Skeleton className="h-4 w-24 bg-muted rounded-none" />
                                    <Skeleton className="h-4 w-16 bg-muted-foreground/20 rounded-none" />
                                </div>
                                <Skeleton className="h-20 w-full bg-muted rounded-none" />
                                <div className="flex gap-6 pt-2">
                                    <Skeleton className="h-8 w-20 bg-muted rounded-none" />
                                    <Skeleton className="h-4 w-12 bg-muted rounded-none" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ThreadItemSkeleton() {
    return (
        <div className="p-10 rounded-none border-2 border-muted flex flex-col gap-4">
            <Skeleton className="h-6 w-3/4 bg-muted rounded-none" />
            <div className="flex gap-6 mt-2">
                <Skeleton className="h-4 w-24 bg-muted rounded-none" />
                <Skeleton className="h-4 w-24 bg-muted rounded-none" />
            </div>
        </div>
    );
}

export function ReviewItemSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-24 bg-muted rounded-none" />
                    <Skeleton className="h-4 w-20 bg-muted rounded-none" />
                </div>
                <Skeleton className="h-4 w-20 bg-muted rounded-none" />
            </div>
            <Skeleton className="h-16 w-full bg-muted rounded-none ml-6 border-l-2 border-muted" />
        </div>
    );
}

export function CommentItemSkeleton() {
    return (
        <div className="flex gap-6 border-b border-muted/20 pb-12 pt-6">
            <Skeleton className="h-10 w-10 bg-muted rounded-none" />
            <div className="flex-1 space-y-4">
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-24 bg-muted rounded-none" />
                    <Skeleton className="h-4 w-16 bg-muted-foreground/20 rounded-none" />
                </div>
                <Skeleton className="h-16 w-full bg-muted rounded-none" />
                <div className="flex gap-6 pt-2">
                    <Skeleton className="h-8 w-20 bg-muted rounded-none" />
                    <Skeleton className="h-4 w-12 bg-muted rounded-none" />
                </div>
            </div>
        </div>
    );
}
