import Link from "next/link";

export const CTA = () => {
    return (
        <section className="py-24 bg-emerald-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
                    Ready to Stop Getting Rejected by Bots?
                </h2>
                <p className="text-xl opacity-90 leading-relaxed mb-12 max-w-2xl mx-auto font-normal">
                    Fix your resume in minutes and start getting interview emails. Join 100,000+ job seekers who stopped fighting the bots and started getting hired.
                </p>
                <div className="flex flex-col items-center gap-6">
                    <Link href="/editor" className="bg-white text-emerald-600 px-10 py-5 rounded-xl font-bold text-xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-emerald-700/20 hover:-translate-y-1 active:translate-y-0">
                        Create My ATS Resume Free
                    </Link>
                    <p className="text-sm opacity-80 font-medium tracking-wide uppercase">Free ATS score included · No credit card required</p>
                </div>
            </div>
        </section>
    );
};
