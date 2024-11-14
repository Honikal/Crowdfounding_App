import React, {useEffect, useState} from 'react';
import styles from '../Styles/MainPage.module.css';
import { FaUser, FaCalendarDay } from 'react-icons/fa';


import { useLocation, useNavigate } from 'react-router-dom';
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
    media: string[],

    nombre_creador: string,
    diasRestantes: number,
    porcentajeFundado: number
}

function MainPage(){
    //Manejamos el recibo de parámetros
    const location = useLocation();
    const { setUser } = useUser();
    const user = location.state?.user; //Recibimos al usuario
    const navigate = useNavigate();

    console.log("Usuario: ", user);

    //Manejar hover
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const [videoIndexes, setVideoIndexes] = useState<{ [key: string]: number }>({});

    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [featuredProject, setFeaturedProject] = useState<Proyecto | null>(null);
    const [recommendedProjects, setRecommendedProjects] = useState<Proyecto[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
            setSelectedCategories(userData.categorias);
            console.log("Asignamos las categorías del usuario: ", userData.categorias);
        }
    }, [location, setUser]);

    useEffect(() => {
        //Otro useEffect independiente que está conectado con el getter del sistema
        //Buscamos la existencia de un vídeo
        const fetchVideoIndexes = async (projects: Proyecto[]) => {
            const indexes: { [key: string]: number } = {};
            for (const proj of projects) {
                const videoIndex = await getFirstVideoIndex(proj.media);
                indexes[proj.idProyecto] = videoIndex
            }
            setVideoIndexes(indexes);
        };

        const getProyectos = async() => {
            const fetchedProyectos = await getProjects();
            setProyectos(fetchedProyectos);
            categorizeProjects(fetchedProyectos, selectedCategories);
            await fetchVideoIndexes(fetchedProyectos);
        }
        getProyectos();
    }, [selectedCategories])

    //Filtrar proyectos
    const categorizeProjects = (fetchedProyectos: Proyecto[], categorias: string[]) => {
        //Filtramos proyectos no expirados
        const activeProyectos = fetchedProyectos.filter(proyecto => proyecto.diasRestantes > 0);

        //Filtrar por proyectos recomendados por las categorías del usuario
        const filteredProjects = categorias.length > 0 
            ? fetchedProyectos.filter(proyecto => 
                proyecto.categorias.some(categoria => categorias.includes(categoria))
            )
            : fetchedProyectos;

        if (activeProyectos.length){
            //Determinamos el proyecto destacado
            const ordenadosPorFondos = filteredProjects.sort((a, b) => 
                (b.fondos_recaudados / b.objetivo_financiero) - (a.fondos_recaudados / a.objetivo_financiero)
            );
            setFeaturedProject(ordenadosPorFondos[0]);
        }
        setRecommendedProjects(filteredProjects);
    }

    //Manejar el sistema de elección de nuevas categorías
    const handleCategoryClick = (categoria: string) => {
        const newCategories = selectedCategories.includes(categoria)
            ? selectedCategories.filter(c => c !== categoria)
            : [...selectedCategories, categoria]

        console.log("Lista categorias anteriores: ", selectedCategories);
        console.log("Lista de categorías nuevas: ", newCategories);

        setSelectedCategories(newCategories);
        categorizeProjects(proyectos, newCategories)
    }


    const isVideoFile = async (fileUrl: string): Promise<boolean> => {
        try {
            const response = await fetch(fileUrl);
            const contentType = response.headers.get("Content-Type");
            return contentType?.startsWith("video/") ?? false;
        } catch (error) {
            console.error("Error fetching file metadata:", error);
            return false;
        }
    };
    const getFirstVideoIndex = async (media: string[]): Promise<number> => {
        for (let i = 0; i < media.length; i++) {
            const isVideo = await isVideoFile(media[i]);
            if (isVideo) {
                return i; // Return index if a video is found
            }
        }
        return -1; // Return -1 if no video is found
    };

    const navigateToProject = (proyecto: Proyecto) => {
        navigate('/project', { state: { user: user, project: proyecto }});
    }

    const DisplayProjectContent = (proyecto: Proyecto) => {
        //Tomamos la index del primer vídeo encontrado
        const videoIndex = videoIndexes[proyecto.idProyecto] ?? -1;

        return (
            <>  
                <div
                    className={styles.mediaContainer}
                    onMouseEnter={() => setHoveredProject(proyecto.idProyecto)}
                    onMouseLeave={() => setHoveredProject(null)}
                >
                    {hoveredProject === proyecto.idProyecto && videoIndex !== -1 ? (
                        <video
                            src={proyecto.media[videoIndex]}
                            className={styles.previewVideo}
                            controls
                            autoPlay
                            muted
                            loop
                            preload='metadata'
                        />
                    ) : (
                        <img
                            src={proyecto.media[0]}
                            alt={proyecto.nombre}
                            className={styles.previewImage}
                        />
                    )}
                </div>
                <div className={styles.UserDisplay}>
                    <FaUser className={styles.userIcon}/>
                    <div className={styles.UserInfo}>
                        <h3>{proyecto.nombre}</h3>
                        <p className={styles.infoProyecto}>{proyecto.nombre_creador}</p>
                        <div className={styles.timeFundsData}>
                            <FaCalendarDay className={styles.calendarIcon}></FaCalendarDay>
                            <p>{proyecto.diasRestantes} días restantes</p>
                            <p>{proyecto.porcentajeFundado}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.Description}>
                    <p id={styles.desc}>{proyecto.descripcion}</p>
                    <div className={styles.Categories}>
                        {proyecto.categorias.map(categoria => (
                            <div
                                className={`${styles.Category}
                                ${selectedCategories.includes(categoria) ? styles.Selected : ''}`}>
                                <p>{categoria}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <CategoryContent categories={totalCategorias} user={user}/>
            <div className={styles.Categories}>
                {totalCategorias.map(categoria => (
                    <div
                        key={categoria}
                        className={`${styles.Category} ${styles.SelectCategory}
                        ${selectedCategories.includes(categoria) ? styles.Selected : ''}`}
                        onClick={() => handleCategoryClick(categoria)}
                    >
                        <p>{categoria}</p>
                    </div>
                ))}
            </div>

            <div className={styles.Mainpage}>

                <div className={styles.Featured}>
                    <h2>Proyecto destacado:</h2>
                    {featuredProject && (
                        <div className={styles.FeaturedProject} onClick={() => navigateToProject(featuredProject)}>
                            {DisplayProjectContent(featuredProject)}
                        </div>
                    )}
                </div>
                <div className={styles.Recommended}>
                    <h2>Proyectos recomendados:</h2>

                    {recommendedProjects.map(project => (
                        <div
                            key={project.idProyecto}
                            className={`
                                ${styles.RecommendedProyecto}
                                ${project.diasRestantes <= 0 ? styles.ProjectExpired : ''} 
                            `}
                            onClick={() => navigateToProject(project)}
                        >
                            {DisplayProjectContent(project)}
                        </div>
                    ))}
                </div>
            </div>
        </>
        
    )
}

export default MainPage;