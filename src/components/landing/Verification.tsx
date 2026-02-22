export const Verification = () => {
    return (
        <section className="py-24 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Verification Process</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Three checks most resumes fail.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 border border-[#e2e8f0] dark:border-slate-800 rounded hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
                        <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-[#10B981] mb-4">
                            <span className="material-symbols-outlined text-[36px]">terminal</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Human-Readable Layout</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            We validate that header data, work history, and education fields are correctly identified by optical and digital parsers.
                        </p>
                    </div>
                    <div className="p-8 border border-[#e2e8f0] dark:border-slate-800 rounded hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
                        <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-[#10B981] mb-4">
                            <span className="material-symbols-outlined text-[36px]">database</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Recruiter Search Matching</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Compare your document against industry-standard requirements to ensure your skills match recruiter search queries.
                        </p>
                    </div>
                    <div className="p-8 border border-[#e2e8f0] dark:border-slate-800 rounded hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
                        <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-[#10B981] mb-4">
                            <span className="material-symbols-outlined text-[36px]">description</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Compliance Check</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Automated checks for problematic elements like text boxes, graphics, and non-standard fonts that break ATS systems.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
