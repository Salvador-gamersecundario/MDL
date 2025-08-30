"use client";
// This component is not used in the static export version
// as NextAuth requires a server environment.
// It is kept here for reference if you move to a server-based hosting.


export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
