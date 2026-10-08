export class ApiError extends Error{
    readonly  status: number
    constructor(
        message: string, status: number
    ){
        super(message);
        this.name = 'ApiError';
        this.status = status
    }
}

async function request<T>(url: string, options: RequestInit = {}, token?: string): Promise<T>{
    const headers = new Headers(options.headers)
    if (options.body) headers.set('Content-Type', 'application/json')
    if(token) headers.set('Authorization', `Bearer ${token}` )
    let response: Response
try {
    response = await fetch(url, {...options, headers})
} catch {throw new Error('No se pudo conectar al servicio, verifica...')} 
const payload: unknown = response.status === 204 ? null : await response.json().catch(()=> null)
if (!response.ok) {
  const body = payload as {
    message?: string | string[]; error?: string }  | null
    const message = Array.isArray(body?.message) ? body.message.join('. ') : body?.message || body?.error || `La solicitud fallóc(${response.status}).`
    throw new ApiError(message, response.status)
}
    return payload as T
}