import Link from "next/link";

export const Comparison = () => {
    return (
        <section className="py-24 bg-[#0f172a] overflow-hidden relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-y {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                `
            }} />

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0f172a] opacity-90"></div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-[pulse-slow_8s_infinite]"></div>
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-[pulse-slow_10s_infinite]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div className="text-white space-y-8">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Resumes optimized for Applicant Tracking Systems (ATS)
                        </h2>
                        <p className="text-lg md:text-xl text-blue-100/80 leading-relaxed max-w-xl">
                            All ResumeATS templates are tested with top Applicant Tracking Systems (ATS) to guarantee full compatibility. With clean layouts, readable fonts, and standard section titles, nothing gets lost by the software.
                        </p>
                        <div className="pt-4">
                            <Link href="/editor" className="inline-flex items-center bg-emerald-500 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:translate-y-0">
                                Build an ATS-Friendly Resume
                            </Link>
                        </div>
                    </div>

                    {/* Right: Visual Demo */}
                    <div className="relative flex justify-center lg:justify-end pr-4 md:pr-12">
                        <div className="relative flex flex-col gap-6 w-full max-w-md animate-[float-y_6s_infinite_ease-in-out]">

                            {/* Card 1 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-6 shadow-2xl translate-x-12 animate-[slide-in-right_1s_ease-out_forwards]">
                                <div className="bg-white rounded-xl p-3 flex-shrink-0 shadow-lg">
                                    <span className="material-symbols-outlined text-indigo-900 font-bold scale-125">contact_mail</span>
                                </div>
                                <span className="text-white text-lg font-bold">Readable contact information</span>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-6 shadow-2xl -translate-x-4 animate-[slide-in-right_1s_ease-out_0.3s_forwards] opacity-0">
                                <div className="bg-white rounded-xl p-3 flex-shrink-0 shadow-lg">
                                    <span className="material-symbols-outlined text-indigo-900 font-bold scale-125">account_tree</span>
                                </div>
                                <span className="text-white text-lg font-bold">Full experience section parsing</span>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-6 shadow-2xl translate-x-8 animate-[slide-in-right_1s_ease-out_0.6s_forwards] opacity-0">
                                <div className="bg-white rounded-xl p-3 flex-shrink-0 shadow-lg">
                                    <span className="material-symbols-outlined text-indigo-900 font-bold scale-125">rocket_launch</span>
                                </div>
                                <span className="text-white text-lg font-bold">Optimized skills section</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
