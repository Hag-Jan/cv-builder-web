import Link from "next/link";

const roles = [
    {
        title: "Software Engineer",
        score: "96/100",
        description: "Tailored for full-stack, frontend, and backend roles with heavy keyword optimization.",
    },
    {
        title: "Project Manager",
        score: "94/100",
        description: "Focuses on methodology, leadership metrics, and complex project delivery history.",
    },
    {
        title: "Data Analyst",
        score: "95/100",
        description: "Highlights technical proficiency, data visualization, and business impact results.",
    },
    {
        title: "Marketing Specialist",
        score: "93/100",
        description: "Designed for growth, digital marketing, and content roles with clear KPI focus.",
    },
];

export const Examples = () => {
    return (
        <section className="py-24 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Resume Examples by Role</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Professional samples designed to pass top company ATS filters.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roles.map((role) => (
                        <div key={role.title} className="group p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary transition-all relative overflow-hidden">
                            <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 mb-4">
                                ATS Score: {role.score}
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">{role.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">{role.description}</p>
                            <Link className="text-primary text-xs font-bold group-hover:underline inline-flex items-center gap-1" href="/examples">View example →</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
