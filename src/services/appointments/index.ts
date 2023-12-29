import { AppointmentDate } from "@prisma/client"

export default class AppointmentsServices {
    async getAllByEmail(email: string) {
        const data = await fetch(`/api/appointments/${email}`)
        const { appointments } = await data.json() as { appointments: AppointmentDate[] }
        return appointments
    }

    async create({ date, time }: { date: string, time: string }) {
        const data = await fetch('/api/appointments/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: await JSON.stringify({ date, time })
        })
        const { appointment } = await data.json() as { appointment: AppointmentDate }
        return appointment
    }

    async remove(id: number) {
        const data = await fetch('/api/appointments/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        const { appointment } = await data.json() as { appointment: AppointmentDate }
        return appointment
    }
}