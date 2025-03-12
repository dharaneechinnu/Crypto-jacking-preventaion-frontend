import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f4;
`;

const Form = styled.form`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
`;

const Input = styled.input`
    width: 90%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #218838;
    }
`;

const LoginLink = styled.p`
    margin-top: 10px;
    font-size: 14px;
    color: #333;
`;

const Register = () => {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            alert("Registration successful! Please login.");
            navigate("/");
        } catch (error) {
            alert("Error registering user");
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <h2>Register</h2>
                <Input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <Button type="submit">Register</Button>
                <LoginLink>
                    Already have an account? <Link to="/">Login</Link>
                </LoginLink>
            </Form>
        </Container>
    );
};

export default Register;
