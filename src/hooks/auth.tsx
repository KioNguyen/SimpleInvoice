import axios from 'axios';
import querystring from 'querystring';
import Http from '../utils/http';



const headerGetProfile = {
    headers: {
        'Content-Type': `application/x-www-form-urlencoded`,
    }
}

const getProfile = async (accessToken: string) => {

    const API = `https://sandbox.101digital.io/membership-service/1.2.0/users/me`

    const result = await axios.get(API, {
        headers: { Authorization: "Bearer " + accessToken }
    })

    return result;
}


let bodyGetAccessToken = {
    "client_id": "oO8BMTesSg9Vl3_jAyKpbOd2fIEa",
    "client_secret": "0Exp4dwqmpON_ezyhfm0o_Xkowka",
    "grant_type": "password",
    "scope": "openid"
}

const getAccessToken = async ({ username, password }) => {
    const API = `${import.meta.env.VITE_BASE_URL}/token?tenantDomain=carbon.super`;
    bodyGetAccessToken['username'] = username;
    bodyGetAccessToken['password'] = password;

    const result = await axios.post(API, querystring.stringify(bodyGetAccessToken))

    return result;
}

export const login = async (payload) => {
    try {
        const access_token = (await getAccessToken(payload)).data.access_token;
        const userData = (await getProfile(access_token)).data?.data;
        const apiToken = userData?.memberships[0]?.token
        const result = {
            fullname: `${userData?.firstName} ${userData?.lastName}`,
            apiToken,
            access_token
        }
        return { data: result };
    } catch (error) {
        throw new Error(error);

    }
}
export const checkJWT = async ({ access_token, apiToken }) => {
    // Temporarily checking the access token
    const sAPI = `/invoice-service/1.0.0/invoices?pageNum=1&pageSize=1`

    const result = await Http.get(sAPI, {
        headers: {
            "Authorization": "Bearer " + access_token,
            "org-token": apiToken,
        }
    })
    return result;
}
