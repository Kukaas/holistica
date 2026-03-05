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
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export function SearchOverlay() {
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
                const response = await api.get(`/protocols?search=${query}`);
                // Hydrating from Laravel pagination structure
                setResults(response.data.data || []);
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
            <div
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/50 text-muted-foreground cursor-pointer hover:bg-muted transition-colors"
            >
                <Search className="h-4 w-4" />
                <span className="text-xs">Search protocols... (⌘K)</span>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search all protocols..."
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>
                        {loading ? "Searching..." : "No protocols found."}
                    </CommandEmpty>
                    {results.length > 0 && (
                        <CommandGroup heading="Protocols">
                            {results.map((protocol) => (
                                <CommandItem
                                    key={protocol.id}
                                    onSelect={() => {
                                        setOpen(false);
                                        router.push(`/protocols/${protocol.id}`);
                                    }}
                                    className="flex flex-col items-start gap-1 py-3"
                                >
                                    <span className="font-medium">{protocol.title}</span>
                                    <span className="text-xs text-muted-foreground line-clamp-1">
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
