class NotificationsServices {
    async NotifyAdmins(email: string) {
        const data = await fetch(`/api/notifications/notify`, {
            method: 'POST',
            body: JSON.stringify({ emailFrom: email }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const { data: result } = await data.json() as { message: string, data: boolean }
        return result
    }
}

export default new NotificationsServices()
