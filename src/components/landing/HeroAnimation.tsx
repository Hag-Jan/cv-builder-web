"use client";

import React from "react";

export const HeroAnimation = () => {
    return (
        <div className="w-full h-full min-h-[500px] flex items-center justify-center relative perspective-1000">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-y {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-y-reverse {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(20px); }
                }
                @keyframes rotate-3d {
                    0%, 100% { transform: rotateY(0deg) rotateX(0deg); }
                    50% { transform: rotateY(5deg) rotateX(2deg); }
                }
                .animate-float-y { animation: float-y 6s ease-in-out infinite; }
                .animate-float-y-slow { animation: float-y 8s ease-in-out infinite; }
                .animate-float-y-fast { animation: float-y 4s ease-in-out infinite; }
                .animate-float-y-reverse { animation: float-y-reverse 7s ease-in-out infinite; }
                `
            }} />

            {/* Background Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 rounded-3xl" />

            {/* Central Resume Mockup */}
            <div className="relative z-10 w-[340px] h-[440px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-8 flex flex-col gap-6 animate-[rotate-3d_10s_ease-in-out_infinite]">
                <div className="flex justify-between items-start mb-2">
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-900 rounded-sm" />
                        <div className="h-2 w-24 bg-emerald-500 rounded-sm" />
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHK2M8H_WgIRhZr__ol0ycq0ESpOE4lC9p4eBY1j-NVAVL_LPoSgg81a4p-uQL0QeNbDjTmNDZIXjJCuNT262UWPRXa46ei91saO7O2o8AljIgAFjBY-urUI-LTS9sj0lgcGnSwyM59XGkRN9XvBgQq2uuU7k0uok_Ti7snI0sIgDp0WN3Xkvm6ZXh3SHFIKsGpJ7lpXZ9kBaxmn_UABYRIA0Hrqb2e4QqMzsxQmF8P0H3rBqqnPDbt9CmVSCoeQJa-qekRfbJp3Lm"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="h-2 w-full bg-slate-100 rounded-full" />
                    <div className="h-2 w-[90%] bg-slate-100 rounded-full" />
                    <div className="h-2 w-[95%] bg-slate-100 rounded-full" />
                </div>

                <div className="mt-4 space-y-4">
                    <div className="h-3 w-20 bg-slate-200 rounded-sm" />
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-50 rounded-full" />
                        <div className="h-2 w-full bg-slate-50 rounded-full" />
                        <div className="h-2 w-[70%] bg-slate-50 rounded-full" />
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-center text-[10px] font-bold text-slate-300 tracking-widest uppercase">
                    <span>Skills</span>
                    <span>Education</span>
                </div>
            </div>

            {/* Floating Element: Font Selector (Left) */}
            <div className="absolute left-[5%] top-[20%] z-20 w-40 bg-white/80 backdrop-blur-md border border-slate-100 rounded-xl shadow-xl p-4 animate-float-y-slow">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Font Selection</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">Rubik</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-sm text-slate-400 font-medium">Lato</div>
                    <div className="text-sm text-slate-400 font-medium tracking-tight">Raleway</div>
                    <div className="text-sm text-slate-400 font-medium">Exo</div>
                </div>
            </div>

            {/* Floating Element: Control Sliders (Bottom Right) */}
            <div className="absolute right-[5%] bottom-[15%] z-20 w-48 bg-white/80 backdrop-blur-md border border-slate-100 rounded-xl shadow-xl p-5 animate-float-y">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Margins</span>
                            <span className="text-[10px] font-bold text-slate-900">24px</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-[60%] bg-emerald-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spacing</span>
                            <span className="text-[10px] font-bold text-slate-900">Dynamic</span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 w-3 h-3 bg-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/3 shadow-sm border-2 border-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Element: HIRED Badges (Top Right & Bottom Left) */}
            <div className="absolute top-[10%] right-[10%] z-0 animate-float-y-fast">
                <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 transform rotate-12">
                    HIRED
                </div>
            </div>

            <div className="absolute bottom-[20%] left-[10%] z-0 animate-float-y-reverse delay-500">
                <div className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full shadow-md transform -rotate-12 border border-emerald-200">
                    HIRED
                </div>
            </div>

            {/* Decorative Dots (Random Floating) */}
            <div className="absolute top-[40%] right-[15%] w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse" />
            <div className="absolute bottom-[40%] left-[15%] w-3 h-3 bg-emerald-400 rounded-full opacity-30 animate-pulse delay-700" />
        </div>
    );
};
