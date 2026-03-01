export const Verification = () => {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Most Resumes Fail ATS</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">It's not your experience—it's how the machines see it.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 border border-border/60 rounded-2xl bg-white shadow-lg hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                            <span className="material-symbols-outlined text-3xl">terminal</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-4">Parsing Visibility</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Many resumes are digital "ghosts". We ensure your header data, work history, and skills are 100% visible to recruitment software.
                        </p>
                    </div>
                    <div className="p-8 border border-border/60 rounded-2xl bg-white shadow-lg hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                            <span className="material-symbols-outlined text-3xl">database</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-4">Keyword Density</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Most candidates use the wrong terminology. We compare your data against industry standards to match what recruiters search for.
                        </p>
                    </div>
                    <div className="p-8 border border-border/60 rounded-2xl bg-white shadow-lg hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                            <span className="material-symbols-outlined text-3xl">description</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-4">Structural Integrity</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Text boxes, graphics, and custom fonts are ATS killers. Our high-fidelity check ensures your file structure remains compliant.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
