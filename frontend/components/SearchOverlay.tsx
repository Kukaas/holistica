"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { protocolService } from "@/lib/services/protocols";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function SearchOverlay({ variant = "full" }: { variant?: "full" | "icon" }) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    React.useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await protocolService.getAll({ search: query });
                setResults(response.data || []);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <>
            {variant === "full" ? (
                <div
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-4 px-6 py-2.5 rounded-none border-2 bg-muted/30 text-muted-foreground cursor-pointer hover:border-foreground transition-all group w-full md:w-auto"
                >
                    <Search className="h-3.5 w-3.5 group-hover:text-foreground transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Search Registry...</span>
                    <kbd className="pointer-events-none hidden md:flex h-5 select-none items-center gap-1 rounded-none border bg-muted px-1.5 font-mono text-[10px] font-black opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none hover:bg-muted"
                    onClick={() => setOpen(true)}
                >
                    <Search className="h-6 w-6" />
                </Button>
            )}

            <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
                <CommandInput
                    placeholder="SEARCH THE ARCHIVE..."
                    onValueChange={setQuery}
                    className="h-16 font-black uppercase tracking-widest text-sm border-none focus:ring-0"
                />
                <CommandList className="max-h-[400px] border-t-4 border-foreground">
                    <CommandEmpty className="py-10 text-center font-black uppercase tracking-widest text-[10px] text-muted-foreground/40">
                        {loading ? "FETCHING..." : "NO MATCHES FOUND."}
                    </CommandEmpty>
                    {results.length > 0 && (
                        <CommandGroup heading="REGISTRY MATCHES" className="font-black uppercase tracking-[0.3em] text-[10px] px-4 pt-4">
                            {results.map((protocol) => (
                                <CommandItem
                                    key={protocol.id}
                                    onSelect={() => {
                                        setOpen(false);
                                        router.push(`/protocols/${protocol.id}`);
                                    }}
                                    className="flex flex-col items-start gap-1 py-6 px-6 rounded-none border-b border-muted last:border-0 hover:bg-muted/30 cursor-pointer"
                                >
                                    <span className="font-black text-lg uppercase tracking-tight">{protocol.title}</span>
                                    <span className="text-[11px] font-medium text-muted-foreground line-clamp-1 italic">
                                        {protocol.content}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
