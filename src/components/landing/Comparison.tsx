import Link from "next/link";

export const Comparison = () => {
    return (
        <section className="pb-12 pt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-12 w-full max-w-4xl">
                        <div className="bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/30 rounded-2xl p-8 shadow-xl shadow-red-500/5 text-center transition-transform hover:-translate-y-1">
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 block">Typical Failure</span>
                            <div className="text-7xl md:text-8xl font-black text-red-500 mb-2 leading-none">47</div>
                            <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 font-bold text-sm uppercase">
                                <span className="material-symbols-outlined text-lg">error</span>
                                Critical Fail
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="material-symbols-outlined text-4xl text-primary font-bold">trending_flat</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border-2 border-primary/20 dark:border-primary/30 rounded-2xl p-8 shadow-2xl shadow-emerald-500/10 text-center transition-transform hover:-translate-y-1">
                            <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-4 block">Interview Ready</span>
                            <div className="text-7xl md:text-8xl font-black text-[#10B981] mb-2 leading-none">92</div>
                            <div className="flex items-center justify-center gap-1 text-[#10B981] font-bold text-sm uppercase">
                                <span className="material-symbols-outlined text-lg text-[#10B981]">check_circle</span>
                                ATS Approved
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 mb-8">
                        <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg italic">
                            Same resume. 60-second transformation.
                        </p>
                        <div className="mt-6">
                            <Link className="inline-flex items-center text-slate-950 dark:text-white font-extrabold hover:text-primary transition-colors border-2 border-slate-400 dark:border-slate-600 px-6 py-2.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800" href="/editor">
                                See your ATS score free →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
