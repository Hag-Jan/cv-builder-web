import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Comparison } from "@/components/landing/Comparison";
import { Examples } from "@/components/landing/Examples";
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
    <main className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen">
      <Navbar />
      <Hero />
      <Comparison />
      <Examples />
      <HowItWorks />
      <Verification />
      <Metrics />
      <Testimonials />
      <Templates />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
