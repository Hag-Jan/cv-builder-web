export const HowItWorks = () => {
    return (
        <section className="py-24 bg-muted/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it Works</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">Three steps. No formatting guesswork. No rejected applications.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    <div className="relative group bg-white p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-2xl mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">1</div>
                        <h3 className="text-xl font-bold text-foreground mb-4">Upload or Build</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">Import your current file or use our editor to structure your experience the right way from scratch.</p>
                    </div>
                    <div className="relative group bg-white p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-2xl mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">2</div>
                        <h3 className="text-xl font-bold text-foreground mb-4">ATS Analysis</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">Our parser scans your document exactly like recruiter software to find hidden errors and keyword gaps.</p>
                    </div>
                    <div className="relative group bg-white p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-2xl mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">3</div>
                        <h3 className="text-xl font-bold text-foreground mb-4">Apply & Get Hired</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">Fix the red flags, download your optimized PDF, and start landing more callbacks and interviews immediately.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
