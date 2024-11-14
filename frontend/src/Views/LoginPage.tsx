import React, { useState, ChangeEvent } from "react";
import { FaUserCircle, FaUserLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from '../Styles/LoginPage.module.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../Components/AuthContext';
import { loginUser } from "../ConnectionToBackend/Routes/loginUser";

interface User {
    email: string;
    password: string;
}

function LoginPage() {
    const { login } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const validateAndSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            alert('Campos obligatorios, por favor rellenar los campos para iniciar sesión');
            return;
        }

        try {
            const userData = await loginUser(email, password, navigate);
            login(); // Actualiza el estado de autenticación
        } catch (error) {
            alert('Inicio de sesión fallido, intenta de nuevo');
        }
    }

    return (
        <div className={styles.LoginPage}>
            <div className={styles.ContentLeft}></div>
            <div className={styles.ContentRight}>
                <div className={styles.Form}>
                    <h1>Es bueno verte de nuevo</h1>
                    <div className={styles.Input}>
                        <FaUserCircle className={styles.icon} />
                        <input
                            className="Input-Data"
                            type="email"
                            placeholder="Usuario o correo"
                            name="email"
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className={styles.Input}>
                        <FaUserLock className={styles.icon} />
                        <input
                            className="Input-Data"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            name="password"
                            onChange={handlePasswordChange}
                        />
                        {showPassword ? (
                            <FaEyeSlash className={`${styles.icon} ${styles.clickable}`} onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEye className={`${styles.icon} ${styles.clickable}`} onClick={togglePasswordVisibility} />
                        )}
                    </div>
                    
                    <button className={`${styles.LoginBtn} ${styles.clickable}`} onClick={validateAndSubmit}>Login</button>
                    <Link to={'/change-password'}>¿Olvidaste la contraseña?</Link>
                    <Link to={'/signup'}>Regístrate ahora</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
