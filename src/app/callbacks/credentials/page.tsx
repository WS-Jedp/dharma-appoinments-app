"use client"

import { UserRole } from "@prisma/client"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect } from "react"

const CallbackCredentials: React.FC = () => {

    const { data: session, status } = useSession()
    
    useEffect(() => {
        if(session) {
            if(session.user.role === UserRole.ADMIN) {
                redirect('/admin')
            }

            if(session.user.role === UserRole.CLIENT) {
                redirect(`/appointments?email=${session.user?.email}`)
            }
        }
    }, [status])

    return (
        <section className="w-full h-screen bg-slate-50">
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl font-bold text-gray-900">Loading...</h1>
            </div>
        </section>
    )
}

export default CallbackCredentials
