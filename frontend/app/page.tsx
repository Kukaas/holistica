"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ArrowRight, Wind } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProtocolCard } from "@/components/ProtocolCard";

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
                <ProtocolCard protocol={protocol} showYear={true} />
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
