export const HowItWorks = () => {
    return (
        <section className="pt-24 pb-[16px] bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How it Works</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Three steps. No formatting guesswork. No rejected applications.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="relative text-center">
                        <div className="w-[36px] h-[36px] bg-[#1F2937] text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">1</div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload or Build Your Resume</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Import your current file or use our editor to structure your experience the right way.</p>
                    </div>
                    <div className="relative text-center">
                        <div className="w-[36px] h-[36px] bg-[#1F2937] text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">2</div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Get Your ATS Analysis</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Our parser scans your document exactly like recruiter software to find hidden errors.</p>
                    </div>
                    <div className="relative text-center">
                        <div className="w-[36px] h-[36px] bg-[#1F2937] text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-6">3</div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Apply with Confidence</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Fix the red flags, download your optimized PDF, and start landing interviews.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
