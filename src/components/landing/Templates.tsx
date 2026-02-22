import Link from "next/link";

export const Templates = () => {
    return (
        <section className="py-24 bg-[#F9FAFB] dark:bg-slate-900/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Professional Resume Templates That Pass ATS</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-base">Clean, structured, recruiter-friendly layouts designed to pass applicant tracking systems.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-6 aspect-[1/1.41] w-full rounded-lg border border-slate-200 resume-preview-shadow text-left space-y-4 mb-4">
                            <div className="w-1/3 h-4 bg-slate-100 rounded"></div>
                            <div className="w-full h-2 bg-slate-50 rounded"></div>
                            <div className="space-y-2 pt-4">
                                <div className="w-1/2 h-3 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-50 rounded"></div>
                                <div className="w-full h-2 bg-slate-50 rounded"></div>
                            </div>
                            <div className="space-y-2 pt-4">
                                <div className="w-1/2 h-3 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-50 rounded"></div>
                                <div className="w-full h-2 bg-slate-50 rounded"></div>
                            </div>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">Modern Professional</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-6 aspect-[1/1.41] w-full rounded-lg border border-slate-100 resume-active-shadow text-left space-y-4 mb-4 transform scale-105 border-primary/20">
                            <div className="border-b border-slate-100 pb-3">
                                <div className="w-1/2 h-5 bg-slate-200 rounded mb-2"></div>
                                <div className="w-1/3 h-3 bg-slate-100 rounded"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="w-1/4 h-3 bg-emerald-500/20 rounded"></div>
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="w-1/4 h-3 bg-emerald-500/20 rounded"></div>
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="w-1/4 h-3 bg-emerald-500/20 rounded"></div>
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">Executive Prime</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-6 aspect-[1/1.41] w-full rounded-lg border border-slate-200 resume-preview-shadow text-left space-y-4 mb-4">
                            <div className="w-1/3 h-4 bg-slate-100 rounded"></div>
                            <div className="w-full h-2 bg-slate-50 rounded"></div>
                            <div className="space-y-2 pt-4">
                                <div className="w-1/2 h-3 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-50 rounded"></div>
                                <div className="w-full h-2 bg-slate-50 rounded"></div>
                            </div>
                            <div className="space-y-2 pt-4">
                                <div className="w-1/2 h-3 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-50 rounded"></div>
                                <div className="w-full h-2 bg-slate-50 rounded"></div>
                            </div>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">Clean Minimalist</span>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <Link href="/templates" className="bg-primary text-white text-base px-10 py-4 rounded font-bold transition-all hover:brightness-110 shadow-lg shadow-emerald-500/20">
                        View All Templates
                    </Link>
                </div>
            </div>
        </section>
    );
};
