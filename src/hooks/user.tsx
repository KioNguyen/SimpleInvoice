import axios from 'axios';
import querystring from 'querystring';

// const querystring = require('querystring');

const sLocalInvoice = localStorage.getItem("user");
const localInvoice = JSON.parse(sLocalInvoice)

const headerOpts = {
    headers: {
        // 'Authorization': `Bearer ${localInvoice?.apiToken}`
        "Access-Control-Allow-Origin": "*",
        'Authorization': `Bearer 3d2e7337-f028-3f50-8abf-461a7fb41ba1`,
        'org-token': "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxMDFEIiwiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvYXBwbGljYXRpb25uYW1lIjoiMTAxRFBheUFwcCIsIm1lbWJlcnNoaXBJZCI6IjJkZDc2YzAyLWY3NjgtNGFiZS1hNTNhLTI4NDlmNTM3YjUwOCIsImV4cCI6MTY3ODYxOTQwMywidXNlcklkIjoiZDIyNThjOGQtOTZiMi00OGU0LTllNGYtMDMxNmUzZjk4MDU5Iiwib3JnSWQiOiI2YmYzMmNjNC0yZGZiLTQwYzYtYmQ0MS1hNmFlYTU1ZmQ0ZGMiLCJsaXN0Um9sZXMiOlsiT3JnYW5pc2F0aW9uT3duZXIiXSwiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvZW50aXR5SWQiOiIxMDFEIn0.201OpgKB0BiAUtRMnPWnnUSKvI22SmCjk-DZlo2hhqw"
    }
}

const headerGetProfile = {
    headers: {
        'Content-Type': `application/x-www-form-urlencoded`,
    }
}


const getInvoiceProfile = async (accessToken: string) => {

    const API = `https://sandbox.101digital.io/membership-service/1.2.0/users/me`

    const result = await axios.get(API, {
        headers: { Authorization: "Bearer " + accessToken }
    })

    return result;
}


const bodyGetAccessToken = {
    "client_id": "oO8BMTesSg9Vl3_jAyKpbOd2fIEa",
    "client_secret": "0Exp4dwqmpON_ezyhfm0o_Xkowka",
    "grant_type": "password",
    "scope": "openid",
    "username": "dung+octopus4@101digital.io",
    "password": "Abc@123456"
}

const getAccessToken = async () => {

    const API = `${import.meta.env.VITE_BASE_URL}/token?tenantDomain=carbon.super`

    const result = await axios.post(API, querystring.stringify(bodyGetAccessToken))

    return result;
}

export const fetchInvoice = async ({ pageNumber, pageSize }: { pageNumber: number, pageSize: number }) => {
    const access_token = (await getAccessToken()).data.access_token;
    console.log("🚀 ~ file: user.tsx:58 ~ fetchInvoice ~ access_token:", access_token)

    const JWT = (await getInvoiceProfile(access_token)).data?.data?.memberships[0]?.token;
    console.log("🚀 ~ file: user.tsx:60 ~ fetchInvoice ~ JWT:", JWT)

    const API = `${import.meta.env.VITE_BASE_URL}/invoice-service/1.0.0/invoices?pageNum=${pageNumber}&pageSize=${pageSize}`

    const result = await axios.get(API, {
        headers: {
            "Authorization": "Bearer " + access_token,
            "org-token": JWT
        }
    })

    return result;
}

export const createInvoice = async (payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/users`

    const result = await axios.post(API, payload, headerOpts)

    return result;
}

export const updateInvoice = async (id, payload) => {
    const API = `${import.meta.env.VITE_BASE_URL}/users/${id}`

    const result = await axios.put(API, payload, headerOpts)

    return result;
}

export const deleteInvoice = async (id) => {
    const API = `${import.meta.env.VITE_BASE_URL}/users/${id}`

    const result = await axios.delete(API, headerOpts)

    return result;
}