import Link from "next/link";

export const CTA = () => {
    return (
        <section className="py-24 bg-secondary text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Build a resume that bypasses filters and reaches recruiters.
                </h2>
                <p className="text-slate-400 text-base mb-10 max-w-xl mx-auto">
                    Join 100,000+ job seekers who stopped fighting the bots and started getting hired.
                </p>
                <div className="flex flex-col items-center gap-4">
                    <Link href="/editor" className="bg-[#10B981] text-white text-base px-10 py-4 rounded font-bold transition-all hover:brightness-110">
                        Create My ATS Resume Free
                    </Link>
                    <p className="text-xs text-slate-400/80 font-medium">Free ATS score included · No credit card required</p>
                </div>
            </div>
        </section>
    );
};
