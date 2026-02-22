import Link from "next/link";

export const Hero = () => {
    return (
        <header className="pt-32 pb-8 lg:pt-40 lg:pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="flex -space-x-3 shrink-0">
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-background-dark object-cover z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjiQepwTR40kvTKy5-xjf8j-gZiZVU7XxO6_8UgiLKnxrYe2CcV7cA_EyDxs0ojv0AXlXcJ1qH_ALPsD7liOw8T-sS3MuPjnNz8za4S0ps6mQN6xqFvXzAkwBeSp8YvsSY7yBligiiUqqDUqFxkBBdMK6g5q_dEquRCsqHsMJD6Y0iQFJQhWdtrA2joVP2TE7FLiTS7BFIhPWSAsgTZH-XFaYGawKJXowjuD46joaeeuBTyoToGJPnBuvgt97pL4cYO_r3cFuad9t-" />
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-background-dark object-cover z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHK2M8H_WgIRhZr__ol0ycq0ESpOE4lC9p4eBY1j-NVAVL_LPoSgg81a4p-uQL0QeNbDjTmNDZIXjJCuNT262UWPRXa46ei91saO7O2o8AljIgAFjBY-urUI-LTS9sj0lgcGnSwyM59XGkRN9XvBgQq2uuU7k0uok_Ti7snI0sIgDp0WN3Xkvm6ZXh3SHFIKsGpJ7lpXZ9kBaxmn_UABYRIA0Hrqb2e4QqMzsxQmF8P0H3rBqqnPDbt9CmVSCoeQJa-qekRfbJp3Lm" />
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-background-dark object-cover z-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC83boA57SIq5nP989Mp71HffB6m6owgLpEZ7BflUyo-HK-MIGf5CiYq2jDovv6pHAMbG3SbOsq_Sex-wexebBD39yg9qq8PuoB1oPdwNNYaLFmAA7h12e4laWM_WQH-wS09go1zF5AlEkUCrq4VPRSD97Ixj-sCkn1NRbuQxK6NnA7aaDpg4y7Um03LpwRBKMRdkcsrQC1H9yoZsKmxcoDPd7BMwfunnOeZppXiwe_-WXChD99A_hViH45EReS1-grrMjzGo_YX9fB" />
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-background-dark object-cover z-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACvX-_LKUe7fh6t2uCkg-NS25NxZ-bdxiuXrz89YEBKVtOKFAZsd_XajMRwqXE2kt_7_dzEeaitvFB1WpGkrIOfEXTfn2jcj-TG4chs2znzzFSWoIPPP3K3OTJOc3LhPoEAW4GyIL2SRSombxQDruKIgiAoZYSCLSDsdXAawJJHPON83NHck7cZ5UumgwJ_0GshXHd3cX6FzZ5Xm_lD2DXdVXju-N_piFcuxKUfyhyNDph0Zr6HQi-tWJHv4h1-IbjDrMzYCoxAkS-" />
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-background-dark object-cover z-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmw9LqxCfYq0uH3SY1b9NCDZc37jqjV62oY1VlRmnnG8kYznFkwlIKgISy4_UqZ7FcjHQ18q73LQ0O3gWBm4qUFVByo5VL0Kx9aiYsHnONLzzGbGVLbUYnhoZjAvzrvhBWZp7cjNwxhUCdH7fAhctKddAVi62La2XiLfY9HHJRJYJL60IqxbGk19hC37os1ifgxepe5Ww50jYQVm0DkVfIckAgB1azI9wZ7X3e72PJtBR5L_mNRRICTu3jv7XlQu2CktDf-CeQQ3l8" />
                            </div>
                            <div className="text-slate-900 dark:text-white">
                                Trusted by <span className="font-extrabold text-xl">100,000+</span> job seekers worldwide
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold leading-[1.1] mb-6 text-slate-900 dark:text-white">
                            Stop being ignored. Build a resume that actually gets you interviews.
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
                            Fix formatting errors causing auto-rejection so recruiters see you.
                        </p>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/editor" className="bg-[#10B981] text-white text-base px-8 py-3.5 rounded font-bold transition-all flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-emerald-500/20">
                                    Create My ATS Resume Free
                                </Link>
                                <Link href="/editor" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 px-8 py-3.5 rounded font-bold transition-all flex items-center justify-center gap-2">
                                    Scan Existing File
                                </Link>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Trustpilot (4.9/5, 2,400+ reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star</span>
                                        <span className="material-symbols-outlined text-orange-400 text-[14px] fill-current">star_half</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Google (4.7/5, 800+ reviews)</span>
                                </div>
                            </div>
                            <div className="text-[14px] text-[#4B5563] dark:text-slate-400 font-medium">
                                Your first resume is 100% free forever. Unlimited edits and downloads for one resume.
                            </div>
                        </div>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">ATS Analysis Report</span>
                                <span className="text-[10px] text-slate-400">ID: 8829-X</span>
                            </div>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative w-20 h-20 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-slate-100 dark:text-slate-800" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="4"></circle>
                                        <circle className="text-[#10B981]" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeDasharray="226.2" strokeDashoffset="22.6" strokeWidth="4"></circle>
                                    </svg>
                                    <span className="absolute text-2xl font-bold text-slate-900 dark:text-white">92</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Pass Strength: High</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] text-slate-500">
                                            <span>Keyword Match:</span>
                                            <span className="font-mono text-slate-700 dark:text-slate-300">88%</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] text-slate-500">
                                            <span>Formatting:</span>
                                            <span className="font-mono text-emerald-600 font-bold uppercase">Pass</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] text-slate-500">
                                            <span>Section Parsing:</span>
                                            <span className="font-mono text-emerald-600 font-bold uppercase">Pass</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 opacity-40">
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                                <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                <div className="h-2 w-4/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
