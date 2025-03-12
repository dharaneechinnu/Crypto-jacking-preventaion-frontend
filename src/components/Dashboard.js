import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { ThemeProvider, createGlobalStyle, keyframes, css } from "styled-components";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { BsCpu, BsSun, BsMoon, BsBellFill, BsXCircle } from "react-icons/bs";
import Web3 from 'web3';

import axios from "axios";

const fetchSystemUsage = async () => {
    return { data: { cpuUsage: Math.floor(Math.random() * 100), gpuUsage: Math.floor(Math.random() * 100) } };
};

const logout = () => {
    console.log("User logged out");
};

// Light & Dark Theme
const lightTheme = {
    body: "#f5f5f5",
    text: "#333",
    cardBg: "#fff",
    shadow: "0 10px 20px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.07)",
    hoverShadow: "0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.12)",
    progressBg: "#e0e0e0",
    buttonBg: "#007bff",
    buttonHover: "#0056b3",
    toggleBg: "#f0f0f0",
    chartBg: "rgba(255, 255, 255, 0.9)",
    borderColor: "#e0e0e0",
    lowUsage: "#4caf50",
    mediumUsage: "#ff9800",
    highUsage: "#f44336",
    alertBg: "#ffebee",
    alertBorder: "#ffcdd2",
    alertText: "#b71c1c"
};

const darkTheme = {
    body: "#121212",
    text: "#e0e0e0",
    cardBg: "#1e1e1e",
    shadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
    hoverShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
    progressBg: "#333",
    buttonBg: "#ff6384",
    buttonHover: "#d6284c",
    toggleBg: "#333",
    chartBg: "rgba(30, 30, 30, 0.9)",
    borderColor: "#333",
    lowUsage: "#4caf50",
    mediumUsage: "#ff9800",
    highUsage: "#f44336",
    alertBg: "#311212",
    alertBorder: "#b71c1c",
    alertText: "#ff8a80"
};

// Global Styles
const GlobalStyle = createGlobalStyle`
    body {
        background-color: ${(props) => props.theme.body};
        color: ${(props) => props.theme.text};
        transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
`;

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
`;

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
`;

const TopSection = styled.div`
    width: 100%;
    max-width: 1800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        
        h1 {
            margin-bottom: 15px;
        }
    }
`;

const Title = styled.h1`
    margin: 0;
    font-size: 38px;
    background: linear-gradient(90deg, ${props => props.theme.buttonBg}, ${props => props.theme.buttonHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 600px) {
        font-size: 24px;
    }
`;

const AlertContainer = styled.div`
    width: 100%;
    max-width: 1800px;
    margin-bottom: 20px;
    animation: ${fadeIn} 0.5s ease-in-out;
`;

const Alert = styled.div`
    background-color: ${props => props.theme.alertBg};
    border: 1px solid ${props => props.theme.alertBorder};
    color: ${props => props.theme.alertText};
    padding: 15px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: ${props => props.theme.shadow};
    animation: ${pulse} 2s infinite;
`;

const AlertIcon = styled.div`
    margin-right: 15px;
    font-size: 20px;
    color: ${props => props.theme.highUsage};
`;

const AlertMessage = styled.div`
    flex-grow: 1;
    font-weight: 500;
`;

const AlertContent = styled.div`
    display: flex;
    align-items: center;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: ${props => props.theme.alertText};
    cursor: pointer;
    font-size: 20px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        opacity: 0.8;
    }
`;

const CardContainer = styled.div`
    display: flex;
    gap: 20px;
    margin: 0 0 30px 0;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 1800px;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }
`;

const Card = styled.div`
    background: ${(props) => props.theme.cardBg};
    padding: 50px;
    border-radius: 12px;
    box-shadow: ${(props) => props.theme.shadow};
    width: calc(50% - 10px);
    max-width: 400px;
    min-width: 250px;
    box-sizing: border-box;
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    position: relative;
    border: 1px solid ${(props) => props.theme.borderColor};
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: ${(props) => props.theme.hoverShadow};
    }

    ${props => props.critical && css`
        animation: ${pulse} 2s infinite;
        border-color: ${props.theme.highUsage};
    `}

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
    gap: 10px;
`;

const CardIcon = styled.div`
    font-size: 34px;
    color: ${(props) => props.theme.buttonBg};
`;

const UsageValue = styled.div`
    font-size: 48px;
    font-weight: bold;
    margin: 10px 0;
    color: ${(props) => {
        const value = parseInt(props.value);
        if (value < 50) return props.theme.lowUsage;
        if (value < 80) return props.theme.mediumUsage;
        return props.theme.highUsage;
    }};
    transition: color 0.3s ease;
`;

const ProgressBar = styled.div`
    height: 30px;
    width: 100%;
    background: ${(props) => props.theme.progressBg};
    border-radius: 5px;
    overflow: hidden;
    margin-top: 15px;
`;

const ProgressFill = styled.div`
    height: 100%;
    width: ${(props) => props.width}%;
    background: ${(props) => {
        const value = parseInt(props.width);
        if (value < 50) return props.theme.lowUsage;
        if (value < 80) return props.theme.mediumUsage;
        return props.theme.highUsage;
    }};
    transition: width 0.5s ease-in-out, background-color 0.3s ease;
`;

const GraphContainer = styled.div`
    width: 100%;
    max-width: 1800px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 10px;
    margin-top: 20px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ChartWrapper = styled.div`
    background: ${(props) => props.theme.cardBg};
    border-radius: 12px;
    padding: 20px;
    box-shadow: ${(props) => props.theme.shadow};
    border: 1px solid ${(props) => props.theme.borderColor};
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: ${(props) => props.theme.hoverShadow};
    }
`;

const ChartTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 15px;
    text-align: center;
    color: ${props => props.color || props.theme.buttonBg};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    
    @media (max-width: 600px) {
        width: 100%;
        justify-content: flex-end;
    }
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: ${(props) => props.theme.buttonBg};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
        background-color: ${(props) => props.theme.buttonHover};
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const ThemeToggle = styled.button`
    background: ${(props) => props.theme.toggleBg};
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.text};
    font-size: 18px;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const RefreshButton = styled(Button)`
    background-color: ${props => props.theme.lowUsage};
    
    &:hover {
        background-color: ${props => `${props.theme.lowUsage}dd`};
    }
`;

const WalletButton = styled(Button)`
    background-color: ${props => props.connected ? props.theme.lowUsage : props.theme.buttonBg};
    min-width: 200px;
    justify-content: center;
    
    &:hover {
        background-color: ${props => props.connected ? `${props.theme.lowUsage}dd` : props.theme.buttonHover};
    }
`;

const WalletAddress = styled.span`
    font-size: 14px;
    opacity: 0.8;
`;

const Dashboard = () => {
    const navigate = useNavigate();
    const [cpuUsage, setCpuUsage] = useState(0);
    const [gpuUsage, setGpuUsage] = useState(0);
    const [cpuData, setCpuData] = useState(Array(10).fill(0));
    const [gpuData, setGpuData] = useState(Array(10).fill(0));
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showCpuAlert, setShowCpuAlert] = useState(false);
    const [showGpuAlert, setShowGpuAlert] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const fetchData = async () => {
        try {
            setIsRefreshing(true);
            const response = await fetchSystemUsage();
            setCpuUsage(response.data.cpuUsage);
            setGpuUsage(response.data.gpuUsage);
            
            // Check if CPU or GPU usage is above 80%
            if (response.data.cpuUsage >= 95) {
                setShowCpuAlert(true);
                // Play alert sound
               
            } else {
                setShowCpuAlert(false);
            }
            
            if (response.data.gpuUsage >= 95) {
                setShowGpuAlert(true);
                // Play alert sound if not already played for CPU
                if (response.data.cpuUsage < 80) {
                 
                }
            } else {
                setShowGpuAlert(false);
            }
            
            // Send email alert if CPU or GPU usage is high
            if (response.data.cpuUsage >= 95 || response.data.gpuUsage >= 95) {
                const userId = localStorage.getItem("userid");
                try {
                    const emailResponse = await axios.post("https://crypto-jacking-preventaion.onrender.comapi/mining/send-email", {
                        userId: userId,
                        cpuUsage: response.data.cpuUsage,
                        gpuUsage: response.data.gpuUsage,
                    });
                    console.log("Email alert sent:", emailResponse.data);
                } catch (error) {
                    console.error("Error sending email alert:", error);
                }
            }
            
            setCpuData(prevData => [...prevData.slice(-9), response.data.cpuUsage]);
            setGpuData(prevData => [...prevData.slice(-9), response.data.gpuUsage]);
        } catch (error) {
            console.error("Error fetching system usage:", error);
        } finally {
            setIsRefreshing(false);
        }
    };
    
    
    const fetchMonitorData = async () => {
        const userId = localStorage.getItem("userid");
        try {
            const response = await axios.post("https://crypto-jacking-preventaion.onrender.comapi/mining/monitor", {
                userId: userId,
                cpuUsage: cpuUsage,
                gpuUsage: gpuUsage,
            });
            console.log("Monitor Response:", response.data);
        } catch (error) {
            console.error("Error monitoring system:", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleRefresh = () => {
        fetchData();
    };

    const toggleTheme = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem("darkMode", newMode);
            return newMode;
        });
    };

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                const web3 = new Web3(window.ethereum);
                setWalletAddress(accounts[0]);
                setIsConnected(true);

                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                        setIsConnected(true);
                    } else {
                        setWalletAddress('');
                        setIsConnected(false);
                    }
                });

                // Listen for chain changes
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });

            } catch (error) {
                console.error("User denied account access", error);
            }
        } else {
            console.log('Please install MetaMask!');
            // You might want to show a modal or alert here
            alert('Please install MetaMask to use this feature!');
        }
    };

    useEffect(() => {
        const checkWalletConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({ 
                    method: 'eth_accounts' 
                });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    setIsConnected(true);
                }
            }
        };
        
        checkWalletConnection();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: darkMode ? '#e0e0e0' : '#333'
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 3,
                hoverRadius: 6
            }
        }
    };

    const cpuChartData = {
        labels: Array(cpuData.length).fill('').map((_, i) => `${i + 1}m ago`),
        datasets: [{
            label: 'CPU Usage %',
            data: cpuData,
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            borderWidth: 2
        }]
    };

    const gpuChartData = {
        labels: Array(gpuData.length).fill('').map((_, i) => `${i + 1}m ago`),
        datasets: [{
            label: 'GPU Usage %',
            data: gpuData,
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            borderWidth: 2
        }]
    };

    // Add this function to render the main dashboard content
    const renderDashboardContent = () => {
        if (!isConnected) {
            return (
                <Card>
                    <CardHeader>
                        <CardIcon><BsCpu /></CardIcon>
                        <span>Connect Wallet</span>
                    </CardHeader>
                    <AlertMessage>
                        Please connect your wallet to view system usage data
                    </AlertMessage>
                    <WalletButton 
                        onClick={connectWallet} 
                        connected={false}
                        style={{ margin: '20px auto' }}
                    >
                        Connect Wallet
                    </WalletButton>
                </Card>
            );
        }

        return (
            <>
                {/* CPU Alert */}
                {showCpuAlert && (
                    <AlertContainer>
                        <Alert>
                            <AlertContent>
                                <AlertIcon><BsBellFill /></AlertIcon>
                                <AlertMessage>
                                    <strong>Critical CPU Usage Alert!</strong> CPU usage is currently at {cpuUsage}%, which exceeds the recommended threshold (80%). This may lead to system performance issues or overheating.
                                </AlertMessage>
                            </AlertContent>
                            <CloseButton onClick={() => setShowCpuAlert(false)}>
                                <BsXCircle />
                            </CloseButton>
                        </Alert>
                    </AlertContainer>
                )}

                {/* GPU Alert */}
                {showGpuAlert && (
                    <AlertContainer>
                        <Alert>
                            <AlertContent>
                                <AlertIcon><BsBellFill /></AlertIcon>
                                <AlertMessage>
                                    <strong>Critical GPU Usage Alert!</strong> GPU usage is currently at {gpuUsage}%, which exceeds the recommended threshold (80%). This may lead to system performance issues or overheating.
                                </AlertMessage>
                            </AlertContent>
                            <CloseButton onClick={() => setShowGpuAlert(false)}>
                                <BsXCircle />
                            </CloseButton>
                        </Alert>
                    </AlertContainer>
                )}

                {/* CPU & GPU Usage Cards */}
                <CardContainer>
                    <Card critical={cpuUsage >= 80}>
                        <CardHeader>
                            <CardIcon><BsCpu /></CardIcon>
                            <span>CPU Usage</span>
                        </CardHeader>
                        <UsageValue value={cpuUsage}>{cpuUsage}%</UsageValue>
                        <ProgressBar>
                            <ProgressFill width={cpuUsage} />
                        </ProgressBar>
                    </Card>
                    <Card critical={gpuUsage >= 80}>
                        <CardHeader>
                            <CardIcon><BsCpu /></CardIcon>
                            <span>GPU Usage</span>
                        </CardHeader>
                        <UsageValue value={gpuUsage}>{gpuUsage}%</UsageValue>
                        <ProgressBar>
                            <ProgressFill width={gpuUsage} />
                        </ProgressBar>
                    </Card>
                </CardContainer>

                {/* Graphs */}
                <GraphContainer>
                    <ChartWrapper>
                        <ChartTitle color="#ff6384">CPU Usage History</ChartTitle>
                        <div style={{ height: '300px' }}>
                            <Line data={cpuChartData} options={chartOptions} />
                        </div>
                    </ChartWrapper>
                    <ChartWrapper>
                        <ChartTitle color="#36a2eb">GPU Usage History</ChartTitle>
                        <div style={{ height: '300px' }}>
                            <Line data={gpuChartData} options={chartOptions} />
                        </div>
                    </ChartWrapper>
                </GraphContainer>
            </>
        );
    };

    // Modify the useEffect for data fetching to only run when connected
    useEffect(() => {
        if (isConnected) {
            // Initial fetch
            fetchData();
            fetchMonitorData();
            // Fetch system usage every 5 seconds
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }
    }, [isConnected]); // Add isConnected as a dependency

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyle />
            <Container>
                {/* Top Section */}
                <TopSection>
                    <Title>System Monitoring Dashboard</Title>
                    <ButtonGroup>
                        <WalletButton 
                            onClick={connectWallet} 
                            connected={isConnected}
                        >
                            {isConnected ? (
                                <>
                                    Connected: 
                                    <WalletAddress>
                                        {`${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`}
                                    </WalletAddress>
                                </>
                            ) : (
                                'Connect Wallet'
                            )}
                        </WalletButton>
                        {isConnected && (
                            <>
                                <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
                                    {isRefreshing ? "Refreshing..." : "Refresh Data"}
                                </RefreshButton>
                                <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
                                    {darkMode ? <BsSun /> : <BsMoon />}
                                </ThemeToggle>
                                <Button onClick={handleLogout}>Logout</Button>
                            </>
                        )}
                    </ButtonGroup>
                </TopSection>

                {/* Render dashboard content based on connection status */}
                {renderDashboardContent()}
            </Container>
        </ThemeProvider>
    );
};

export default Dashboard;