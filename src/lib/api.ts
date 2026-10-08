export interface AuthResponse { token: string; email: string; role: string }
export interface Account { id: number; accountNumber: string; balance: number; accountType: string }
export interface Transaction { id: number; sourceAccountNumber: string; destinationAccount: string; amount: number; transactionType: string; description: string; timestamp: string }
export interface Quote { c: number; d: number; dp: number; h: number; l: number; o: number; pc: number; t: number }
export interface CompanyProfile { country?: string; currency?: string; exchange?: string; finnhubIndustry?: string; logo?: string; marketCapitalization?: number; name?: string; ticker?: string; weburl?: string }
export interface TransferValues { sourceAccountNumber: string; destinationAccountNumber: string; amount: number; description: string }

export class ApiError extends Error {
    readonly status: number
    constructor(message: string, status: number) { super(message); this.name = 'ApiError'; this.status = status }
}

async function request<T>(url: string, options: RequestInit = {}, token?: string): Promise<T> {
    const headers = new Headers(options.headers)
    if (options.body) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    let response: Response
    try { response = await fetch(url, { ...options, headers }) } catch { throw new Error('No se pudo conectar con el servicio. Verifica que esté iniciado.') }
    const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null)
    if (!response.ok) {
        const body = payload as { message?: string | string[]; error?: string } | null
        const message = Array.isArray(body?.message) ? body.message.join('. ') : body?.message || body?.error || `La solicitud falló (${response.status}).`
        throw new ApiError(message, response.status)
    }
    return payload as T
}

export const bankApi = {
    login: (email: string, password: string) => request<AuthResponse>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (firstName: string, lastName: string, email: string, password: string) => request<AuthResponse>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify({ firstName, lastName, email, password }) }),
    getAccounts: (token: string) => request<Account[]>('/api/v1/accounts', {}, token),
    getTransactions: (accountNumber: string, token: string) => request<Transaction[]>(`/api/v1/transactions/account/${encodeURIComponent(accountNumber)}`, {}, token),
    transfer: (values: TransferValues, token: string) => request<Transaction>('/api/v1/transactions/transfer', { method: 'POST', body: JSON.stringify(values) }, token),
}

export const marketApi = {
    getQuote: (symbol: string) => request<Quote>(`/finnhub/quote?symbol=${encodeURIComponent(symbol)}`),
    getProfile: (symbol: string) => request<CompanyProfile>(`/finnhub/profile?symbol=${encodeURIComponent(symbol)}`),
}