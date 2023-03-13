import Http from "../utils/http";

Http.interceptors.request.use(
    (req) => {
        const sLocalUser = localStorage.getItem("user");
        const localUser = JSON.parse(sLocalUser);
        if (localUser) {
            req.headers["Authorization"] = `Bearer ${localUser.access_token}`;
            req.headers["org-token"] = localUser.apiToken;
        }
        if (req.method == "POST") {
            req.headers["Operation-Mode"] = "SYNC";
        }
        return req;
    },
    (err) => {
        return Promise.reject(err);
    }
)


export const fetchInvoice = async ({ pageNumber, pageSize, ordering, orderBy, keyword, status }: { pageNumber: number, pageSize: number, ordering: string, orderBy: string, keyword: string, status: string }) => {
    ordering = ordering === "asc" ? "ASCENDING" : "DESCENDING";
    const sAPI = `/invoice-service/1.0.0/invoices?pageNum=${pageNumber}&pageSize=${pageSize}&ordering=${ordering}&orderBy=${orderBy || ""}&keyword=${keyword || ""}&status=${status || ""}`
    return Http.get(sAPI)
}

export const createInvoice = async (payload) => {
    const API = `/invoice-service/2.0.0/invoices`

    const result = await Http.post(API, payload)

    return result;
}

export const updateInvoice = async (id, payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/users/${id}`

    const result = await Http.put(API, payload)

    return result;
}

export const deleteInvoice = async (id) => {
    const API = `${import.meta.env.VITE_BASE_URL}/users/${id}`

    const result = await Http.delete(API)

    return result;
}