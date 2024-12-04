//src/app/(root)/layout.tsx
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const loggedIn = await getLoggedInUser();

  //   if(!loggedIn) redirect('/sign-in')

  return <main className=" h-screen">{children}</main>;
}
