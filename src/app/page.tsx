// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black">
//       <h1 className="text-4xl font-bold">ResumeATS Baseline</h1>
//       <p className="mt-4 text-xl">The application shell is now working correctly.</p>
//       <div className="mt-8 p-4 border border-green-500 rounded bg-green-50 text-green-700">
//         ✅ Rendering Verified
//       </div>
//     </main>
//   );
// }


import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}


