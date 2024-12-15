
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; 


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }
  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-black-3">     
      {children}
    </main>
  );
}
