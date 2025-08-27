export class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async request<T>(
        endpoint: string,
        method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
        data?: any,
        customHeaders: Record<string, string> = {},
        withAuth: boolean = true   // 👈 flag để bật/tắt Authorization
    ): Promise<T> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...customHeaders,
        };

        // withAuth = true >>> thêm token
        if (withAuth) {
            const token = Cookies.get("access_token");
            if (token && !headers["Authorization"]) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }

        const options: RequestInit = {
            method,
            headers,
            credentials: "include", // HttpOnly cookies
        };

        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(this.baseURL + endpoint, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return (await response.json()) as T;
    }

    get<T>(endpoint: string, headers: Record<string, string> = {}, withAuth = true) {
        return this.request<T>(endpoint, "GET", undefined, headers, withAuth);
    }

    getWithoutAuth<T>(endpoint: string, headers: Record<string, string> = {}, withAuth = false) {
        return this.request<T>(endpoint, "GET", undefined, headers, withAuth);
    }

    post<T>(endpoint: string, data: any, headers: Record<string, string> = {}, withAuth = true) {
        return this.request<T>(endpoint, "POST", data, headers, withAuth);
    }

    postWithoutAuth<T>(endpoint: string, data: any, headers: Record<string, string> = {}, withAuth = false) {
        return this.request<T>(endpoint, "POST", data, headers, withAuth);
    }

    // 👇 Login không cần token
    login<T>(endpoint: string, data: any) {
        return this.request<T>(endpoint, "POST", data, {}, false);
    }
}
