import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Comparison } from "@/components/landing/Comparison";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Verification } from "@/components/landing/Verification";
import { Metrics } from "@/components/landing/Metrics";
import { Testimonials } from "@/components/landing/Testimonials";
import { Templates } from "@/components/landing/Templates";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-background text-foreground font-sans min-h-screen">
      <Navbar />
      <div className="flex flex-col space-y-32">
        <Hero />
        <Comparison />
        <HowItWorks />
        <Verification />
        <Metrics />
        <Testimonials />
        <div className="flex justify-center py-12 bg-muted/30">
          <Link
            href="/editor"
            className="text-emerald-600 hover:text-emerald-700 transition-all text-lg font-bold flex items-center gap-2 px-8 py-3 rounded-2xl bg-white shadow-sm border border-border/60 hover:shadow-md"
          >
            Check Your Resume Score
            <span className="material-symbols-outlined font-bold text-sm">trending_flat</span>
          </Link>
        </div>
        <Templates />
        <FAQ />
        <CTA />
      </div>
      <Footer />
    </main>
  );
}
