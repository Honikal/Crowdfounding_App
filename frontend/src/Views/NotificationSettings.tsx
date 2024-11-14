import React, { useEffect, useState } from "react";
import styles from '../Styles/NotificationSettings.module.css';
import { fetchNotificationTemplates } from "../ConnectionToBackend/Routes/fetchNotificationTemplates";

// Interfaz para plantillas de notificación
interface NotificationTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    eventTrigger: string;
}

function NotificationSettings() {
    const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
    const [newTemplate, setNewTemplate] = useState({ name: "", subject: "", body: "", eventTrigger: "" });

    useEffect(() => {
        const getTemplates = async () => {
            const data = await fetchNotificationTemplates();
            setTemplates(data);
        };
        getTemplates();
    }, []);

    const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTemplate({ ...newTemplate, [name]: value });
    };

    const handleTemplateSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTemplate) {
            setTemplates(templates.map(t => t.id === selectedTemplate.id ? newTemplate : t));
        } else {
            setTemplates([...templates, { id: Date.now().toString(), ...newTemplate }]);
        }
        setNewTemplate({ name: "", subject: "", body: "", eventTrigger: "" });
        setSelectedTemplate(null);
    };

    const handleTemplateSelect = (template: NotificationTemplate) => {
        setSelectedTemplate(template);
        setNewTemplate(template);
    };

    const handleTemplateDelete = (id: string) => {
        setTemplates(templates.filter(template => template.id !== id));
    };

    return (
        <div className={styles.NotificationSettings}>
            <h1>Configuración de Notificaciones</h1>
            <section className={styles.TemplateListSection}>
                <h2>Plantillas de Notificación</h2>
                <ul className={styles.TemplateList}>
                    {templates.map(template => (
                        <li key={template.id} onClick={() => handleTemplateSelect(template)} className={styles.TemplateItem}>
                            <h3>{template.name}</h3>
                            <p><strong>Asunto:</strong> {template.subject}</p>
                            <p><strong>Evento:</strong> {template.eventTrigger}</p>
                            <button onClick={() => handleTemplateDelete(template.id)} className={styles.DeleteBtn}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className={styles.TemplateEditorSection}>
                <h2>{selectedTemplate ? "Editar Plantilla" : "Crear Nueva Plantilla"}</h2>
                <form onSubmit={handleTemplateSave} className={styles.TemplateForm}>
                    <label>Nombre de la Plantilla:
                        <input type="text" name="name" value={newTemplate.name} onChange={handleTemplateChange} required />
                    </label>
                    <label>Asunto:
                        <input type="text" name="subject" value={newTemplate.subject} onChange={handleTemplateChange} required />
                    </label>
                    <label>Cuerpo del Mensaje:
                        <textarea name="body" value={newTemplate.body} onChange={handleTemplateChange} required />
                    </label>
                    <label>Evento que Activa:
                        <select name="eventTrigger" value={newTemplate.eventTrigger} onChange={handleTemplateChange} required>
                            <option value="" disabled>Selecciona un evento</option>
                            <option value="Registro">Registro</option>
                            <option value="Recordatorio">Recordatorio</option>
                            <option value="Actualización de Estado">Actualización de Estado</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </label>
                    <button type="submit" className={styles.SaveBtn}>Guardar Plantilla</button>
                </form>
            </section>
        </div>
    );
}

export default NotificationSettings;