export const Metrics = () => {
    return (
        <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center items-start">
                    <div className="flex flex-col items-center px-4">
                        <div className="text-4xl md:text-5xl font-black text-secondary dark:text-primary mb-3">2X</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Interview Callbacks</div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
                            Land twice as many interviews by fixing hidden formatting errors.
                        </p>
                    </div>
                    <div className="flex flex-col items-center px-4 md:border-x border-slate-200 dark:border-slate-800">
                        <div className="text-4xl md:text-5xl font-black text-secondary dark:text-primary mb-3">4.5x</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">More Responses</div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
                            Compared to unoptimized resumes submitted to major job boards.
                        </p>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <div className="text-5xl md:text-6xl font-black text-secondary dark:text-primary mb-3 leading-tight">6 Days</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Median time to first callback.</div>
                        <p className="text-[11px] text-[#6B7280] leading-relaxed max-w-[240px]">
                            Based on internal user data.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
