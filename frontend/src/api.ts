export const apiGet = async (path: string, init: RequestInit = {}) => {
    const res = await fetch(`/api/${path}`, {
        ...init, 
        headers: { 'Content-Type': 'application/json', ...init.headers}
    })

    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }

    return res.status === 204 ? undefined: await res.json()
}