export const Metrics = () => {
    return (
        <section className="bg-background border-y border-border/50 py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center items-start">
                    <div className="flex flex-col items-center px-4 group">
                        <div className="text-5xl md:text-7xl font-black text-emerald-600 mb-6 tracking-tighter transition-transform group-hover:scale-105 duration-300">2X</div>
                        <div className="text-sm font-bold text-foreground uppercase tracking-widest mb-4">Interview Callbacks</div>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-[280px] font-normal">
                            Land twice as many interviews by fixing hidden formatting errors recruiters hate.
                        </p>
                    </div>
                    <div className="flex flex-col items-center px-4 md:border-x border-border group">
                        <div className="text-5xl md:text-7xl font-black text-emerald-600 mb-6 tracking-tighter transition-transform group-hover:scale-105 duration-300">4.5x</div>
                        <div className="text-sm font-bold text-foreground uppercase tracking-widest mb-4">More Responses</div>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-[280px] font-normal">
                            Compared to unoptimized resumes submitted to major job boards.
                        </p>
                    </div>
                    <div className="flex flex-col items-center px-4 group">
                        <div className="text-5xl md:text-7xl font-black text-emerald-600 mb-6 tracking-tighter transition-transform group-hover:scale-105 duration-300">6 Days</div>
                        <div className="text-sm font-bold text-foreground uppercase tracking-widest mb-4">Time to Callback</div>
                        <p className="text-base text-muted-foreground leading-relaxed max-w-[280px] font-normal">
                            The median time for our users to receive their first interview invitation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
