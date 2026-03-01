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
        <section className="py-24 bg-muted/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">User Success</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">Real results from real applications.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.name} className="bg-white p-8 md:p-10 rounded-2xl border border-border shadow-lg relative transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                            <div className="flex justify-between items-start mb-8">
                                <div className="bg-emerald-50 h-12 w-12 rounded-xl flex items-center justify-center text-emerald-600">
                                    <span className="material-symbols-outlined text-3xl">format_quote</span>
                                </div>
                            </div>
                            <p className="text-lg text-foreground italic mb-8 leading-relaxed font-medium">"{t.quote}"</p>
                            <div className="flex items-center gap-4 border-t border-border pt-6">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
