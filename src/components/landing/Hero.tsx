"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroAnimation } from "./HeroAnimation";

export const Hero = () => {
    // Simplified Hero component logic as score animation is now handled inside HeroAnimation or visually replaced

    return (
        <header className="py-24 lg:py-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="flex -space-x-3 shrink-0">
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjiQepwTR40kvTKy5-xjf8j-gZiZVU7XxO6_8UgiLKnxrYe2CcV7cA_EyDxs0ojv0AXlXcJ1qH_ALPsD7liOw8T-sS3MuPjnNz8za4S0ps6mQN6xqFvXzAkwBeSp8YvsSY7yBligiiUqqDUqFxkBBdMK6g5q_dEquRCsqHsMJD6Y0iQFJQhWdtrA2joVP2TE7FLiTS7BFIhPWSAsgTZH-XFaYGawKJXowjuD46joaeeuBTyoToGJPnBuvgt97pL4cYO_r3cFuad9t-" />
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHK2M8H_WgIRhZr__ol0ycq0ESpOE4lC9p4eBY1j-NVAVL_LPoSgg81a4p-uQL0QeNbDjTmNDZIXjJCuNT262UWPRXa46ei91saO7O2o8AljIgAFjBY-urUI-LTS9sj0lgcGnSwyM59XGkRN9XvBgQq2uuU7k0uok_Ti7snI0sIgDp0WN3Xkvm6ZXh3SHFIKsGpJ7lpXZ9kBaxmn_UABYRIA0Hrqb2e4QqMzsxQmF8P0H3rBqqnPDbt9CmVSCoeQJa-qekRfbJp3Lm" />
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover z-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC83boA57SIq5nP989Mp71HffB6m6owgLpEZ7BflUyo-HK-MIGf5CiYq2jDovv6pHAMbG3SbOsq_Sex-wexebBD39yg9qq8PuoB1oPdwNNYaLFmAA7h12e4laWM_WQH-wS09go1zF5AlEkUCrq4VPRSD97Ixj-sCkn1NRbuQxK6NnA7aaDpg4y7Um03LpwRBKMRdkcsrQC1H9yoZsKmxcoDPd7BMwfunnOeZppXiwe_-WXChD99A_hViH45EReS1-grrMjzGo_YX9fB" />
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover z-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACvX-_LKUe7fh6t2uCkg-NS25NxZ-bdxiuXrz89YEBKVtOKFAZsd_XajMRwqXE2kt_7_dzEeaitvFB1WpGkrIOfEXTfn2jcj-TG4chs2znzzFSWoIPPP3K3OTJOc3LhPoEAW4GyIL2SRSombxQDruKIgiAoZYSCLSDsdXAawJJHPON83NHck7cZ5UumgwJ_0GshXHd3cX6FzZ5Xm_lD2DXdVXju-N_piFcuxKUfyhyNDph0Zr6HQi-tWJHv4h1-IbjDrMzYCoxAkS-" />
                                <img alt="User" className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover z-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmw9LqxCfYq0uH3SY1b9NCDZc37jqjV62oY1VlRmnnG8kYznFkwlIKgISy4_UqZ7FcjHQ18q73LQ0O3gWBm4qUFVByo5VL0Kx9aiYsHnONLzzGbGVLbUYnhoZjAvzrvhBWZp7cjNwxhUCdH7fAhctKddAVi62La2XiLfY9HHJRJYJL60IqxbGk19hC37os1ifgxepe5Ww50jYQVm0DkVfIckAgB1azI9wZ7X3e72PJtBR5L_mNRRICTu3jv7XlQu2CktDf-CeQQ3l8" />
                            </div>
                            <div className="text-foreground/80 font-medium">
                                Trusted by <span className="text-emerald-600 font-bold">100,000+</span> job seekers
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground">
                            Build a Resume That Actually Gets Interviews
                        </h1>
                        <p className="text-lg lg:text-xl text-muted-foreground mb-10 font-normal leading-relaxed">
                            Pass ATS filters. Impress recruiters. Get more callbacks.
                        </p>
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/editor" className="bg-emerald-600 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:bg-emerald-700 hover:-translate-y-0.5 shadow-lg shadow-emerald-600/20 active:translate-y-0">
                                    Create My ATS Resume Free
                                </Link>
                                <Link href="/editor" className="bg-white text-foreground border border-border hover:bg-muted px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                                    Scan Existing File
                                </Link>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
                                <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined text-[#ffb400] text-[14px] fill-current">star</span>
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-foreground/70 tracking-tight">Trustpilot 4.9/5</span>
                                </div>
                                <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(4)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined text-[#ffb400] text-[14px] fill-current">star</span>
                                        ))}
                                        <span className="material-symbols-outlined text-[#ffb400] text-[14px] fill-current">star_half</span>
                                    </div>
                                    <span className="text-xs font-semibold text-foreground/70 tracking-tight">Google 4.7/5</span>
                                </div>
                            </div>

                            <div className="text-sm text-muted-foreground/80 italic">
                                Your first resume is 100% free forever. No credit card required.
                            </div>
                        </div>
                    </div>
                    <div className="relative flex items-center justify-center lg:justify-end">
                        <div className="w-full max-w-xl">
                            <HeroAnimation />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
