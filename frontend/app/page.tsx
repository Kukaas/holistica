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
        const response = await api.get("/protocols", {
          params: { sort: "rating" }
        });
        setProtocols(response.data.data.slice(0, 6)); // Show top 6 rated
      } catch (error) {
        console.error("Error fetching protocols:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProtocols();
  }, []);

  return (
    <div className="container min-h-screen py-24 md:py-48 px-6 md:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-12 mb-40 md:mb-64">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-6 py-2 rounded-none bg-muted/30 border-l-4 border-foreground text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <Wind className="h-4 w-4 text-foreground" />
          <span>Verified Healthcare Protocols</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter max-w-5xl leading-[0.8] text-foreground"
        >
          Open-source community for verified wellness.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-xl md:text-2xl max-w-2xl leading-snug font-medium mt-6"
        >
          Discover, share, and discuss healthcare protocols vetted by our community of experts and practitioners.
        </motion.p>
      </section>

      {/* Featured Protocols */}
      <section className="space-y-24">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-6 border-b-2 border-muted pb-12">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Archive</span>
            <h2 className="text-4xl font-black tracking-tight">Featured Protocols</h2>
          </div>
          <Link href="/protocols" className="text-xs font-black uppercase tracking-widest flex items-center gap-3 group hover:opacity-70 transition-opacity">
            View all protocols <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 rounded-none bg-muted animate-pulse border-2" />
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
                  <Card className="h-full hover:border-foreground transition-all group border-2 border-muted/60 shadow-none bg-muted/5 overflow-hidden rounded-none flex flex-col">
                    <CardHeader className="p-10 pb-6">
                      <div className="flex justify-between items-start mb-10">
                        <Badge variant="secondary" className="bg-foreground text-background rounded-none text-[9px] uppercase tracking-[0.2em] font-black py-1.5 px-4">
                          {protocol.tags?.[0] || "General"}
                        </Badge>
                        <div className="flex items-center gap-2 text-[11px] font-black">
                          <Star className="h-4 w-4 fill-foreground" />
                          {protocol.avg_rating}
                        </div>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl font-black leading-tight tracking-tight group-hover:text-foreground/70 transition-colors">
                        {protocol.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-10 pb-10">
                      <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                        {protocol.content}
                      </p>
                    </CardContent>
                    <CardFooter className="px-10 py-10 flex items-center justify-between border-t border-muted/20 mt-auto bg-muted/10">
                      <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {protocol.threads_count || 0}
                        </span>
                        <span className="flex items-center gap-2">
                          <Star className="h-3.5 w-3.5" />
                          {protocol.reviews_count || 0}
                        </span>
                        <span>{new Date(protocol.created_at || Date.now()).getFullYear()}</span>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                        Details
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
