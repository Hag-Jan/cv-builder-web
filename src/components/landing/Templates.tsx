import Link from "next/link";

export const Templates = () => {
    return (
        <section className="py-24 bg-muted/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Professional Resume Templates That Pass ATS</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">Clean, structured, recruiter-friendly layouts designed to pass applicant tracking systems.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="flex flex-col items-center group">
                        <div className="bg-white p-6 aspect-[1/1.41] w-full rounded-2xl border border-border/60 shadow-lg text-left space-y-4 mb-6 group-hover:shadow-xl group-hover:border-emerald-100 transition-all duration-300">
                            <div className="w-1/3 h-4 bg-muted rounded"></div>
                            <div className="w-full h-2 bg-muted/50 rounded"></div>
                            <div className="space-y-2 pt-4">
                                <div className="w-1/2 h-3 bg-muted rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                            </div>
                            <div className="space-y-2 pt-4">
                                <div className="w-1/2 h-3 bg-muted rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-foreground/80 tracking-widest uppercase">Modern Professional</span>
                    </div>
                    <div className="flex flex-col items-center group">
                        <div className="bg-white p-6 aspect-[1/1.41] w-full rounded-2xl border-2 border-emerald-500/20 shadow-lg text-left space-y-4 mb-6 transform scale-105 group-hover:scale-[1.08] transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-bl-xl shadow-lg">Popular</div>
                            <div className="border-b border-border pb-3">
                                <div className="w-1/2 h-5 bg-muted rounded mb-2"></div>
                                <div className="w-1/3 h-3 bg-muted/50 rounded"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="w-1/4 h-3 bg-emerald-500/10 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="w-1/4 h-3 bg-emerald-500/10 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="w-1/4 h-3 bg-emerald-500/10 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-emerald-600 tracking-widest uppercase">Executive Prime</span>
                    </div>
                    <div className="flex flex-col items-center group">
                        <div className="bg-white p-6 aspect-[1/1.41] w-full rounded-2xl border border-border/60 shadow-lg text-left space-y-4 mb-6 group-hover:shadow-xl group-hover:border-emerald-100 transition-all duration-300">
                            <div className="w-1/3 h-4 bg-muted rounded"></div>
                            <div className="w-full h-2 bg-muted/50 rounded"></div>
                            <div className="space-y-2 pt-4">
                                <div className="w-1/2 h-3 bg-muted rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                            </div>
                            <div className="space-y-2 pt-4">
                                <div className="w-1/2 h-3 bg-muted rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                                <div className="w-full h-2 bg-muted/50 rounded"></div>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-foreground/80 tracking-widest uppercase">Clean Minimalist</span>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <Link href="/templates" className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10 hover:-translate-y-1 active:translate-y-0">
                        View All Templates
                    </Link>
                </div>
            </div>
        </section>
    );
};
