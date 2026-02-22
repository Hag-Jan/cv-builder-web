export const FAQ = () => {
    return (
        <section className="py-24 bg-white dark:bg-background-dark">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-6" open>
                        <summary className="flex justify-between items-center font-bold text-slate-900 dark:text-white cursor-pointer list-none">
                            How much does ResumeATS cost?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Your first resume is 100% free forever, including unlimited edits and downloads. We offer a premium subscription for job seekers who need multiple resumes for different roles or advanced AI-driven keyword matching.
                        </p>
                    </details>
                    <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-6">
                        <summary className="flex justify-between items-center font-bold text-slate-900 dark:text-white cursor-pointer list-none">
                            Is my resume really ATS compatible?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Absolutely. Our resumes are engineered and rigorously tested against the proprietary parsing logic of major ATS platforms like Greenhouse, Workday, and Lever. We ensure that every section, from your contact details to complex work histories, is accurately categorized by the algorithms recruiters use to screen candidates.
                        </p>
                    </details>
                    <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-6">
                        <summary className="flex justify-between items-center font-bold text-slate-900 dark:text-white cursor-pointer list-none">
                            How do you handle my personal data?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Data security is our top priority. Your data is encrypted at rest and in transit. We do not sell your personal information to third-party recruiters or data brokers.
                        </p>
                    </details>
                    <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-6">
                        <summary className="flex justify-between items-center font-bold text-slate-900 dark:text-white cursor-pointer list-none">
                            Can I download my resume as a PDF?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Yes, all users can download their resumes as high-quality, ATS-friendly PDF files. Premium users also have the option to export in Word format for manual tweaking.
                        </p>
                    </details>
                    <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-6">
                        <summary className="flex justify-between items-center font-bold text-slate-900 dark:text-white cursor-pointer list-none">
                            Do you offer cover letter templates too?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            We do! We offer matching cover letter templates that maintain the same professional design and ATS-optimized structure as your resume.
                        </p>
                    </details>
                </div>
            </div>
        </section>
    );
};
