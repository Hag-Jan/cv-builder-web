import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-background border-t border-border/50 pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="bg-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-600/20">R</div>
                            <span className="font-black text-xl tracking-tighter text-foreground uppercase">ResumeATS</span>
                        </div>
                        <p className="text-muted-foreground text-base mb-6 max-w-xs leading-relaxed font-normal">
                            Built to help you skip the bots and get the interviews your hard work deserves.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-foreground mb-8">Platform</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-semibold">
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/templates">Resume Templates</Link></li>
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/pricing">Pricing Plans</Link></li>
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/ats-checker">ATS Checker</Link></li>
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/editor">Resume Builder</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-foreground mb-8">Resources</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-semibold">
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/docs/parsing">Parsing Docs</Link></li>
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/docs/templates">Template Guide</Link></li>
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/blog">Career Advice</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-foreground mb-8">Company</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-semibold">
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/privacy">Privacy Policy</Link></li>
                            <li><Link className="hover:text-emerald-600 transition-colors" href="/status">Status</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border/50 pt-12 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">© 2024 RESUMEATS INC. ALL SYSTEMS OPERATIONAL.</p>
                </div>
            </div>
        </footer>
    );
};
