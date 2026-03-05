"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await authService.login({ email, password });
            login(data.access_token, data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-[80vh] flex items-center justify-center py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-12"
            >
                <div className="space-y-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">Access Core</span>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Login</h1>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                        Enter your credentials to engage with the registry
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 p-12 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-background">
                    {error && (
                        <div className="bg-destructive/10 border-2 border-destructive p-4 text-[11px] font-black uppercase tracking-widest text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <Mail className="h-3 w-3" /> Email Hash
                            </Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.com"
                                className="rounded-none border-2 border-muted h-14 font-black bg-muted/5 focus:border-foreground transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <Lock className="h-3 w-3" /> Secure Key
                            </Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="rounded-none border-2 border-muted h-14 font-black bg-muted/5 focus:border-foreground transition-all"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-none h-16 font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all text-sm group"
                    >
                        {loading ? "Decrypting..." : (
                            <span className="flex items-center gap-2">
                                Authenticate <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>

                    <div className="pt-6 border-t-2 border-muted text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            New to Holistica?{" "}
                            <Link href="/register" className="text-foreground hover:underline underline-offset-4">
                                Create an Identity
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
