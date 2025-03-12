import React, { useState, useEffect } from "react";
import { fetchSystemUsage, monitorMining } from "../services/miningService";

const MiningMonitor = () => {
    const [cpuUsage, setCpuUsage] = useState(0);
    const [gpuUsage, setGpuUsage] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getUsage = async () => {
            try {
                const response = await fetchSystemUsage();
                setCpuUsage(response.data.cpuUsage);
                setGpuUsage(response.data.gpuUsage);
            } catch (error) {
                console.error("Error fetching system usage:", error);
            }
        };

        // Fetch system usage every 5 seconds
        const interval = setInterval(getUsage, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleMonitor = async () => {
        try {
            const response = await monitorMining({ cpuUsage, gpuUsage });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Unauthorized mining detected! Mining blocked.");
        }
    };

    return (
        <div>
            <h2>Mining Monitor</h2>
            <p>CPU Usage: {cpuUsage}%</p>
            <p>GPU Usage: {gpuUsage}%</p>
            <button onClick={handleMonitor}>Check Mining</button>
            <p>{message}</p>
        </div>
    );
};

export default MiningMonitor;
