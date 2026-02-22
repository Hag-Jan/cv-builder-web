const testimonials = [
    {
        name: "Marcus Chen",
        role: "Software Engineer, Fintech",
        quote: "I secured 3 interviews in 2 weeks after using ResumeATS.",
    },
    {
        name: "Sarah Jenkins",
        role: "Marketing Manager, Fortune 500",
        quote: "My callback rate doubled within ten days of updating my layout.",
    },
    {
        name: "Liam O’Connor",
        role: "Recent Graduate, SaaS",
        quote: "I was hired within 30 days of graduation after fixing my formatting.",
    },
];

export const Testimonials = () => {
    return (
        <section className="py-24 bg-[#F9FAFB] dark:bg-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">User Success</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">Real results from real applications.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.name} className="bg-[#FFFFFF] dark:bg-slate-900 p-6 border border-[#E5E7EB] dark:border-slate-800 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-primary">
                                    <span className="material-symbols-outlined text-[32px] font-bold">format_quote</span>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 italic mb-6">"{t.quote}"</p>
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                                    <p className="text-[11px] text-slate-500 uppercase font-medium">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
