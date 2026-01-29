 "use client";

// import { AuthProvider } from "@/contexts/AuthContext";

// export function Providers({ children }: { children: React.ReactNode }) {
//     return (
//         <AuthProvider>
//             {children}
//         </AuthProvider>
//     );
// }


// "use client";

// // import { AuthProvider } from "@/contexts/AuthContext";
// import { AuthProvider } from "../contexts/AuthContext";


// export function Providers({ children }: { children: React.ReactNode }) {
//   return <AuthProvider>{children}</AuthProvider>;
// }

// "use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ResumeProvider } from "@/contexts/ResumeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ResumeProvider>{children}</ResumeProvider>
    </AuthProvider>
  );
}
