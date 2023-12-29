"use client"

import { UserRole } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaDoorOpen } from "react-icons/fa";

export const Header: React.FC = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session?.user?.role === UserRole.ADMIN) {
      setIsAdmin(true);
    }
  }, [session])
  

  function handleLogout() {
    signOut({
      callbackUrl: "/",
    });
  }

  return (
    <header
      className="
        flex flex-row items-center justify-between
        bg-white shadow-sm rounded-md
        w-full
        mb-10 p-6
      "
    >

      <div className="relative flex flex-row items-center justify-start">
        <h1 className="font-semibold text-lg">{session?.user?.email}</h1>
        <div className="w-[3px] h-[30px] mx-2 bg-black"></div>
        {
          isAdmin ? (
            <Link className="text-xs hover:text-purple-700 underline px-1" href="/admin">
              Admin panel
            </Link>
          ) : (
            <Link className="text-xs" href={`/appointments?email=${session?.user.email}`}>
              My appointments
            </Link>
          )
        }
      </div>

      <button
        className="
            bg-white transition-all border border-red-300 text-red-600 text-xs font-semibold py-2 px-5 rounded-full hover:bg-red-500 hover:text-white mr-2 flex flex-row items-center justify-center
          "
        onClick={handleLogout}
      >
        <FaDoorOpen size={18} className="mr-2" />
        Logout
      </button>
    </header>
  );
};
