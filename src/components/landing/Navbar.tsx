import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="fixed w-full z-50 bg-white/95 dark:bg-background-dark/95 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-secondary dark:bg-primary w-7 h-7 rounded flex items-center justify-center text-white font-bold text-lg">R</div>
                        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white uppercase">ResumeATS</span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="/templates">Templates</Link>
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="/examples">Resume Examples</Link>
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="/cover-letter">Cover Letter</Link>
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="/ats-checker">ATS Checker</Link>
                        <Link className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium" href="/pricing">Pricing</Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link className="text-slate-600 dark:text-white text-sm font-medium hover:text-primary transition-colors" href="/login">Log in</Link>
                        <Link className="bg-secondary dark:bg-white dark:text-secondary text-white px-4 py-2 rounded text-sm font-semibold transition-all" href="/editor">Get Started</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
