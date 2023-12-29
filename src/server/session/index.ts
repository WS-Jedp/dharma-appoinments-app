import { GET } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
export const getServerAuthSession = () => getServerSession(GET);
