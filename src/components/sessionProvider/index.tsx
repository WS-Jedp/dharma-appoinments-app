"use client";

import { SessionProvider } from "next-auth/react";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};

export default Providers;
