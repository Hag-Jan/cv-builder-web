import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-secondary dark:bg-primary w-6 h-6 rounded flex items-center justify-center text-white font-bold text-sm">R</div>
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white uppercase">ResumeATS</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs leading-relaxed">
                            Built to help you skip the bots and get the interviews your hard work deserves.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/ats-checker">ATS Checker</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/editor">Resume Builder</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/cover-letter">Cover Letter</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/examples">Resume Examples</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/docs/parsing">Parsing Docs</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/docs/templates">Template Guide</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/blog">Career Advice</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-slate-900 dark:text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/status">Status</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-[11px] font-medium tracking-wide">© 2024 RESUMEATS INC. ALL SYSTEMS OPERATIONAL.</p>
                </div>
            </div>
        </footer>
    );
};
