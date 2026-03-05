"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowRight, Wind } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [protocols, setProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProtocols() {
      try {
        const response = await api.get("/protocols");
        setProtocols(response.data.data.slice(0, 6)); // Show first 6
      } catch (error) {
        console.error("Error fetching protocols:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProtocols();
  }, []);

  return (
    <div className="container min-h-screen py-16 md:py-32 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 mb-32 md:mb-48">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border text-muted-foreground text-[10px] sm:text-xs font-semibold tracking-wide uppercase"
        >
          <Wind className="h-3 w-3" />
          <span>Verified Healthcare Protocols</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter max-w-4xl leading-[0.9]"
        >
          Open-source community for verified wellness.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mt-4"
        >
          Discover, share, and discuss healthcare protocols vetted by our community of experts and practitioners.
        </motion.p>
      </section>

      {/* Featured Protocols */}
      <section className="space-y-12">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b pb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Protocols</h2>
          <Link href="/protocols" className="text-sm font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity">
            View all protocols <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse border" />
            ))
          ) : (
            protocols.map((protocol, i) => (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/protocols/${protocol.id}`}>
                  <Card className="h-full hover:border-foreground/30 transition-all group border-muted/60 shadow-none bg-card/50 overflow-hidden rounded-2xl">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex justify-between items-start mb-6">
                        <Badge variant="secondary" className="bg-muted text-[10px] sm:text-[11px] uppercase tracking-widest font-bold py-1 px-3">
                          {protocol.tags?.[0] || "General"}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {protocol.avg_rating}
                        </div>
                      </div>
                      <CardTitle className="text-xl md:text-2xl leading-tight group-hover:text-foreground/80 transition-colors">
                        {protocol.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {protocol.content}
                      </p>
                    </CardContent>
                    <CardFooter className="px-8 pb-8 pt-0 flex items-center justify-between border-t border-muted/30 mt-auto pt-6">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {protocol.discussion_count} Discussions
                      </div>
                      <div className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
                        Read More
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
