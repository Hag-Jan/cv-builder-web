"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { ATSProvider } from "@/contexts/ATSContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ResumeProvider>
        <ATSProvider>{children}</ATSProvider>
      </ResumeProvider>
    </AuthProvider>
  );
}
