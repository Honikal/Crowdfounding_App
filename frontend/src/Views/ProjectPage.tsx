import React, {useEffect, useState} from 'react';
import styles from '../Styles/Proyecto.module.css';
import { FaUser, FaCalendarDay } from 'react-icons/fa';

import { useLocation } from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import CategoryContent from '../Components/CategoryContent';
import { getProjects } from '../ConnectionToBackend/Routes/getProjects';

interface Proyecto {
    idProyecto: string,
    id_creador: string,
    activa: boolean,
    nombre: string,
    descripcion: string,
    categorias: string[],
    fecha_creacion: string,
    fecha_limite: string,
    fondos_recaudados: number,
    objetivo_financiero: number,
    media: string[]
}

function ProjectPage(){
    //Manejamos el recibo de parámetros
    const location = useLocation();
    const { setUser } = useUser();
    const user = location.state?.user;        //Recibimos al usuario
    const proyecto = location.state?.project //Recibimos el proyecto seleccionado

    const [totalCategorias, setTotalCategorias] = useState<string[]>([
        "Tecnología", 
        "Cocina",
        "Videojuegos", 
        "Educación", 
        "Social", 
        "Ciencia", 
        "Arte", 
        "Salud y bienestar",
        "Cómics",
        "Música",
        "Artesanías"
    ])

    useEffect(() => {
        //Asumimos que obtenemos los datos del usuario de otro modo
        const userData = location.state?.user;
        if (userData){
            setUser(userData);
        }
    }, [location, setUser]);

    return (
        <>
            <CategoryContent categories={totalCategorias} user={user}/>
            <div className={styles.ProjectPage}>
                <div className={styles.ProjectName}>
                    <h1>{proyecto.nombre}</h1>
                    <p>{proyecto.descripcion}</p>
                </div>

                <div className={styles.ProyectContent}>
                    <div className={styles.MediaContent}>
                        <img
                            src={proyecto.media[0]}
                            alt={proyecto.nombre}
                            className={styles.previewImage}
                        />
                        <div className={styles.MediaContentCategories}>
                            {proyecto.categorias.map((categoria: string) => (
                                <div
                                    className={`
                                        ${styles.Category}
                                        ${user.categorias.includes(categoria) ? styles.CategoryUser : ''}
                                    `}>
                                    <p>{categoria}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.CardContent}>
                        <div className={styles.CardContentLabel}>
                            <h2>{proyecto.fondos_recaudados}$</h2>
                            <p>Contribuido de {proyecto.objetivo_financiero}$</p>
                        </div>

                        {/* Acá se pondría el número de donadores
                            <div className={styles.CardContentLabel}>
                                <h2>{proyecto.fondos_recaudados}$</h2>
                                <p>Contribuido de {proyecto.objetivo_financiero}</p>
                            </div>
                        */}

                        <div className={styles.CardContentLabel}>
                            <h2>{proyecto.diasRestantes}</h2>
                            <p>días más</p>
                        </div>

                        <div className={styles.DonateButton}>
                            <p>Patrocina éste proyecto</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}

export default ProjectPage;