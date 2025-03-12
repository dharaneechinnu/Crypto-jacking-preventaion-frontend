import axios from "axios";

const API_URL = "http://localhost:3500/api/auth/";

export const register = async (userData) => {
    return await axios.post(API_URL + "register", userData);
};

export const login = async (userData) => {
    const response = await axios.post(API_URL + "login", userData);
    console.log(response);
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userid", response.data.userId);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};
