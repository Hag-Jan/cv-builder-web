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
        <section className="py-24 bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Resume Examples by Role</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">Professional samples designed to pass top company ATS filters.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roles.map((role) => (
                        <div key={role.title} className="group p-8 bg-white rounded-3xl border border-border/60 hover:border-emerald-500/30 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 border border-emerald-100">
                                ATS Score: {role.score}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{role.title}</h3>
                            <p className="text-sm text-muted-foreground mb-8 leading-relaxed line-clamp-2">{role.description}</p>
                            <Link className="text-emerald-600 text-sm font-bold group-hover:text-emerald-700 inline-flex items-center gap-2" href="/editor">
                                Try this structure
                                <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 transition-transform">trending_flat</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
