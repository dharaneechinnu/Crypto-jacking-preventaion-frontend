import axios from "axios";

const API_URL = "http://localhost:3500/api/mining/";

export const fetchSystemUsage = async () => {
    return await axios.get(API_URL + "system-usage");
};

export const monitorMining = async (data) => {
    const token = localStorage.getItem("token");
    return await axios.post(API_URL + "monitor", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
