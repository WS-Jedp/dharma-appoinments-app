import { User } from "@prisma/client"

class UsersServices {
    async getAllClientUsers() {
        const data = await fetch(`/api/users/list`)
        const { data: { users } } = await data.json() as { message: string, data: { users: User[] } }
        return users
    }

    async addNewUser({ email, password }: { email: string, password: string }) {
        const data = await fetch('/api/users/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: await JSON.stringify({ email, password })
        })
        const { data: { user } } = await data.json() as { message: string, data: { user: User } }
        return user
    }

    async remove(id: number) {
        const data = await fetch('/api/users/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        const { data: { user } } = await data.json() as { message: string, data: { user: User } }
        return user
    }

    async updatePassword({ id, password }: { id: number, password: string }) {
        const data = await fetch('/api/users/update/password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password })
        })
        const { data: { user } } = await data.json() as { message: string, data: { user: User } }
        return user
    }
}

export default new UsersServices()