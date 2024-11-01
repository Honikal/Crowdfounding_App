import React, {useState, useEffect, ChangeEvent} from "react";
import { FaUserCircle, FaUserLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import styles from '../Styles/LoginPage.module.css';
import { Link } from "react-router-dom";

//Por cada uso de datos tipo object se ocupa un posible Interface
interface User{
    email: string,
    password: string
};

function LoginPage() {
    const [usuario, setUsuario] = useState<User>({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    //Función encargada de controlar el struct esperado para recibir datos de entrada del usuario
    const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsuario(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    //Función encargada de manejar visualmente el cómo funciona el botón de toggle password
    const togglePasswordVissibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className={styles.LoginPage}>
            <div className={styles.ContentLeft}>

            </div>
            <div className={styles.ContentRight}>
                <div className={styles.Form}>
                    <h1>Es bueno verte de nuevo</h1>
                    <div className={styles.Input}>
                        <FaUserCircle className={styles.icon}/>
                        <input
                            className="Input-Data"
                            type="email"
                            placeholder="Usuario o correo"
                            name="email"
                            onChange={handleUserChange}
                        />
                    </div>
                    <div className={styles.Input}>
                        <FaUserLock className={styles.icon}/>
                        <input
                            className="Input-Data"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            name="password"
                            onChange={handleUserChange}
                        />
                        { showPassword ? (
                            <FaEyeSlash className={`${styles.icon} ${styles.clickable}`} onClick={togglePasswordVissibility}/>
                        ) : (
                            <FaEye className={`${styles.icon} ${styles.clickable}`} onClick={togglePasswordVissibility}/>
                        )}
                    </div>
                    
                    <button className= {`${styles.LoginBtn} ${styles.clickable}`}> Login</button>
                    <Link to={'/change_password'}>
                        <a>¿Olvidaste la contraseña?</a>
                    </Link> 
                    <Link to={'/signup'}>
                        <a>Regístrate ahora</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;