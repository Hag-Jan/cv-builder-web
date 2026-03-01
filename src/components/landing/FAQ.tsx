export const FAQ = () => {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center tracking-tight">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    <details className="group border border-border/60 rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300" open>
                        <summary className="flex justify-between items-center font-bold text-lg text-foreground cursor-pointer list-none">
                            How much does ResumeATS cost?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-emerald-600 font-bold">expand_more</span>
                        </summary>
                        <p className="mt-4 text-base text-muted-foreground leading-relaxed font-normal">
                            Your first resume is 100% free forever, including unlimited edits and downloads. We offer a premium subscription for job seekers who need multiple resumes for different roles or advanced AI-driven keyword matching.
                        </p>
                    </details>
                    <details className="group border border-border/60 rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
                        <summary className="flex justify-between items-center font-bold text-lg text-foreground cursor-pointer list-none">
                            Is my resume really ATS compatible?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-emerald-600 font-bold">expand_more</span>
                        </summary>
                        <p className="mt-4 text-base text-muted-foreground leading-relaxed font-normal">
                            Yes. We’ve built our templates to be easily read by the software top companies use. Your resume will be formatted exactly how recruiters want it, with all your details correctly picked up by their systems.
                        </p>
                    </details>
                    <details className="group border border-border/60 rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
                        <summary className="flex justify-between items-center font-bold text-lg text-foreground cursor-pointer list-none">
                            How do you handle my personal data?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-emerald-600 font-bold">expand_more</span>
                        </summary>
                        <p className="mt-4 text-base text-muted-foreground leading-relaxed font-normal">
                            Data security is our top priority. Your data is encrypted at rest and in transit. We do not sell your personal information to third-party recruiters or data brokers.
                        </p>
                    </details>
                    <details className="group border border-border/60 rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300">
                        <summary className="flex justify-between items-center font-bold text-lg text-foreground cursor-pointer list-none">
                            Can I download my resume as a PDF?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-emerald-600 font-bold">expand_more</span>
                        </summary>
                        <p className="mt-4 text-base text-muted-foreground leading-relaxed font-normal">
                            Yes, all users can download their resumes as high-quality, ATS-friendly PDF files. Premium users also have the option to export in Word format for manual tweaking.
                        </p>
                    </details>
                    <details className="group border border-border rounded-xl bg-background p-6 shadow-sm">
                        <summary className="flex justify-between items-center font-semibold text-foreground cursor-pointer list-none">
                            Do you offer cover letter templates too?
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-muted-foreground">expand_more</span>
                        </summary>
                        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                            We do! We offer matching cover letter templates that maintain the same professional design and ATS-optimized structure as your resume.
                        </p>
                    </details>
                </div>
            </div>
        </section>
    );
};
