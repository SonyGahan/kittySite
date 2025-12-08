// 🐾 Script.js - Funciones generales para todas las páginas

// ===== ANIMACIONES DE FADE-IN =====
document.addEventListener('DOMContentLoaded', function () {
    // Configuración del observer
    const observerOptions = {
        threshold: 0,
        rootMargin: '0px 0px -20px 0px'
    };

    // Crear el observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    // Observar todas las secciones con fade-in
    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });
});

// ===== SMOOTH SCROLLING =====
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== NAVBAR EFFECTS =====
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(191, 90, 54, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.backgroundColor = 'rgba(191, 90, 54, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
});

// ===== UTILIDADES GENERALES =====

// Función para mostrar mensajes toast
function showToast(message, type = 'info') {
    // Crear el elemento toast
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;

    // Estilos del toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    // Colores según el tipo
    const colors = {
        info: '#3498db',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        kitty: '#bf5a36'
    };

    toast.style.backgroundColor = colors[type] || colors.info;

    // Añadir al DOM
    document.body.appendChild(toast);

    // Mostrar toast
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Ocultar toast después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ===== FUNCIONES PARA VELITAS =====

// Array para almacenar las velitas
// INSTANCIAS DE STORAGE (Base de datos local)
const dbVelitas = new StorageManager('kitty_velitas');
let velitas = dbVelitas.getAll();

// Mensajes predefinidos para las velitas
const mensajesVelitas = [
    "Por todos los gatitos que nos han dado amor",
    "Gracias por este momento de paz",
    "Que la luz llegue a quien la necesita",
    "Por Kitty, que siempre vivirá en nuestros corazones",
    "Que encuentres sol donde haya sombra",
    "Por las pequeñas cosas que nos hacen sonreír",
    "Gracias por este refugio de amor",
    "Que cada día traiga nueva esperanza",
    "Por los momentos de ternura compartidos",
    "Luz para todas las almas que necesitan consuelo"
];

// Función para inicializar las velitas
function inicializarVelitas() {
    const altar = document.getElementById('altar-velitas');
    if (altar) {
        // Recargamos del storage por seguridad
        velitas = dbVelitas.getAll();

        // Si NO hay datos guardados (es la primera vez que entra), creamos los ejemplos
        if (velitas.length === 0) {
            for (let i = 0; i < 8; i++) {
                // Creamos el objeto manualmente aquí para no llamar a crearVelita y duplicar lógica
                const velitaEjemplo = {
                    id: Date.now() + Math.random(),
                    mensaje: mensajesVelitas[Math.floor(Math.random() * mensajesVelitas.length)],
                    encendida: Math.random() > 0.5,
                    fecha: new Date()
                };
                dbVelitas.add(velitaEjemplo); // Guardamos en DB
            }
            // Actualizamos la variable local con los ejemplos recién creados
            velitas = dbVelitas.getAll();
        }
        renderizarVelitas();
    }
}

// Función para crear una nueva velita (Usuario)
function crearVelita(mensaje = null) {
    const velita = {
        id: Date.now() + Math.random(),
        mensaje: mensaje || mensajesVelitas[Math.floor(Math.random() * mensajesVelitas.length)],
        encendida: false, // Las nuevas siempre nacen apagadas
        fecha: new Date()
    };

    // GUARDAR: Usamos el manager
    dbVelitas.add(velita);
    // ACTUALIZAR: Refrescamos la lista local
    velitas = dbVelitas.getAll();

    return velita;
}

// Función para renderizar todas las velitas
function renderizarVelitas() {
    const altar = document.getElementById('altar-velitas');
    if (!altar) return;

    altar.innerHTML = '';

    velitas.forEach(velita => {
        const velitaElement = document.createElement('div');
        velitaElement.className = `velita ${velita.encendida ? 'encendida' : ''}`;
        velitaElement.innerHTML = `
            <div class="velita-icon">
                <i class="fas fa-fire"></i>
            </div>
            <div class="velita-texto">${velita.mensaje}</div>
        `;

        // Evento para encender/apagar velita
        velitaElement.addEventListener('click', () => {
            velita.encendida = !velita.encendida;
            velitaElement.classList.toggle('encendida');

            if (velita.encendida) {
                showToast('Velita encendida con amor 🕯️', 'kitty');
            }
            // === LÍNEA NUEVA: Guardar el cambio de estado ===
            dbVelitas.saveAll(velitas);
        });

        altar.appendChild(velitaElement);
    });
}

// Función para encender una nueva velita (llamada desde el botón)
function encenderVelita() {
    // Crear modal para pedir mensaje personalizado
    const mensaje = prompt('¿Qué deseo o agradecimiento quieres compartir?');

    if (mensaje && mensaje.trim() !== '') {
        const nuevaVelita = crearVelita(mensaje.trim());
        nuevaVelita.encendida = true;
        renderizarVelitas();
        showToast('Tu velita ha sido encendida 🕯️✨', 'success');

        // Scroll suave al altar
        document.getElementById('altar-velitas').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// ===== FUNCIONES PARA GATITOS =====

// Array para almacenar los gatitos
const dbGatitos = new StorageManager('kitty_gatitos');
let gatitos = dbGatitos.getAll();

// Función para inicializar galería de gatitos
function inicializarGatitos() {
    // Cargar datos reales
    gatitos = dbGatitos.getAll();

    // Solo si está vacío, cargamos los ejemplos
    if (gatitos.length === 0) {
        const gatitosEjemplo = [
            { nombre: "Luna", historia: "Luna llegó a mi vida cuando más la necesitaba" },
            { nombre: "Milo", historia: "Milo me enseñó que el amor viene en pequeños gestos" },
            { nombre: "Kitty", historia: "Kitty fue mi compañera de sol y sombra" },
            { nombre: "Coco", historia: "Coco me recuerda cada día que hay belleza en lo simple" }
        ];

        // Guardamos los ejemplos uno por uno
        gatitosEjemplo.forEach(g => dbGatitos.add(g));
        gatitos = dbGatitos.getAll();
    }
    renderizarGatitos();
}

// Función para renderizar la galería de gatitos
function renderizarGatitos() {
    const contenedor = document.querySelector('.gatitos .row');
    if (!contenedor) return;

    // Limpiar contenedor (mantener las cards de instrucciones)
    const cards = contenedor.querySelectorAll('.gatito-card');
    cards.forEach(card => {
        if (!card.querySelector('.fas')) {
            card.remove();
        }
    });

    // Añadir gatitos
    gatitos.forEach(gatito => {
        const gatitaCard = document.createElement('div');
        gatitaCard.className = 'col-md-4 mb-3';
        gatitaCard.innerHTML = `
            <div class="gatito-card">
                <div class="gatito-foto">
                    <i class="fas fa-cat fa-3x mb-3 text-warning"></i>
                </div>
                <h5>${gatito.nombre}</h5>
                <p class="small">"Este es ${gatito.nombre}, y me ayuda a ver el sol."</p>
                <p class="text-muted small">${gatito.historia}</p>
            </div>
        `;
        contenedor.appendChild(gatitaCard);
    });
}

// Función para compartir mascota
function compartirMascota() {
    const nombre = prompt('¿Cómo se llama tu mascota?');
    if (!nombre || nombre.trim() === '') return;

    const historia = prompt('Cuéntanos brevemente cómo te ayuda a ver el sol:');
    if (!historia || historia.trim() === '') return;

    const nuevoGatito = {
        nombre: nombre.trim(),
        historia: historia.trim()
    };

    // GUARDAR EN STORAGE
    dbGatitos.add(nuevoGatito);
    gatitos = dbGatitos.getAll(); // Refrescar

    renderizarGatitos();
    showToast(`${nombre} ha sido añadido a nuestra galería de amor 🐾`, 'success');
}

// ===== FUNCIONES PARA CONVERSACIONES =====

// Array para almacenar conversaciones
const dbConversaciones = new StorageManager('kitty_conversaciones');
let conversaciones = dbConversaciones.getAll();

// Función para inicializar conversaciones
function inicializarConversaciones() {
    conversaciones = dbConversaciones.getAll();

    if (conversaciones.length === 0) {
        const conversacionesEjemplo = [
            { alias: "LunaInquieta", mensaje: "Hoy me sentí mejor gracias a este espacio", fecha: new Date() },
            { alias: "CorazónGatuno", mensaje: "Extraño mucho a mi gatita, pero encontré consuelo aquí", fecha: new Date() },
            { alias: "SolBrillante", mensaje: "Gracias por recordarme que no estoy sola", fecha: new Date() }
        ];

        conversacionesEjemplo.forEach(c => dbConversaciones.add(c));
        conversaciones = dbConversaciones.getAll();
    }
    renderizarConversaciones();
}

// Función para renderizar conversaciones
function renderizarConversaciones() {
    const contenedor = document.querySelector('#conversaciones .row');
    if (!contenedor) return;

    // Limpiar mensajes anteriores
    const mensajesAnteriores = contenedor.querySelectorAll('.mensaje-usuario');
    mensajesAnteriores.forEach(msg => msg.remove());

    // Añadir conversaciones
    conversaciones.forEach(conv => {
        const conversacionElement = document.createElement('div');
        conversacionElement.className = 'col-12 mensaje-usuario mb-3';
        conversacionElement.innerHTML = `
            <div class="conversacion-card">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong class="text-warning">${conv.alias}</strong>
                    <small class="text-muted">${conv.fecha.toLocaleDateString()}</small>
                </div>
                <p class="mb-0">${conv.mensaje}</p>
            </div>
        `;
        contenedor.appendChild(conversacionElement);
    });
}

// Función para escribir mensaje
function escribirMensaje() {
    const alias = prompt('¿Cómo te gustaría que te llamemos? (ej: LunaInquieta, CorazónGatuno)');
    if (!alias || alias.trim() === '') return;

    const mensaje = prompt('Comparte tus sentimientos o pensamientos:');
    if (!mensaje || mensaje.trim() === '') return;

    const nuevaConversacion = {
        alias: alias.trim(),
        mensaje: mensaje.trim(),
        fecha: new Date()
    };

    // GUARDAR EN STORAGE
    dbConversaciones.add(nuevaConversacion);
    conversaciones = dbConversaciones.getAll();

    renderizarConversaciones(); // Nota: al recargar se ordenarán según como los guarde el storage
    showToast('Tu mensaje ha sido compartido con cariño 💙', 'success');
}

// ===== FUNCIONES PARA RINCÓN DE PAZ =====

// Array de postales inspiradoras
const postales = [
    "A veces, basta una mirada para recordarnos que aún hay belleza en este mundo.",
    "En cada amanecer, Kitty me enseñaba que siempre hay una nueva oportunidad de ser feliz.",
    "Los gatos no juzgan tu tristeza, simplemente se acurrucan a tu lado hasta que pase.",
    "Mamá decía: 'Los gatos llegan a nuestras vidas cuando más los necesitamos'.",
    "Cada ronroneo es una pequeña oración de agradecimiento por el momento presente.",
    "No hay therapia más efectiva que un gato dormido en tu regazo.",
    "Kitty me enseñó que el amor no se mide en años, sino en momentos compartidos.",
    "A veces, la medicina más poderosa es una pequeña pata que se posa en tu mano.",
    "Los gatos guardan secretos del corazón que solo ellos saben cómo sanar.",
    "Gracias por venir. Que encuentres sol donde haya sombra."
];

// Función para mostrar postal aleatoria
function mostrarPostalAleatoria() {
    const postal = postales[Math.floor(Math.random() * postales.length)];

    // Crear modal de postal
    const modalPostal = document.createElement('div');
    modalPostal.className = 'modal-postal';
    modalPostal.innerHTML = `
        <div class="postal-content">
            <div class="postal-header">
                <i class="fas fa-envelope-open-text fa-2x mb-3"></i>
                <h4>Postal del Corazón</h4>
            </div>
            <div class="postal-body">
                <p class="postal-text">"${postal}"</p>
            </div>
            <div class="postal-footer">
                <button class="btn btn-sm btn-outline-light" onclick="cerrarPostal()">
                    <i class="fas fa-heart me-1"></i> Gracias
                </button>
            </div>
        </div>
    `;

    // Estilos del modal
    modalPostal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;

    const postalContent = modalPostal.querySelector('.postal-content');
    postalContent.style.cssText = `
        background: linear-gradient(135deg, #bf5a36, #e2ad7e);
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        margin: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: fadeInScale 0.3s ease-out;
    `;

    // Añadir animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modalPostal);

    // Cerrar modal al hacer clic fuera
    modalPostal.addEventListener('click', (e) => {
        if (e.target === modalPostal) {
            cerrarPostal();
        }
    });
}

// Función para cerrar postal
function cerrarPostal() {
    const modal = document.querySelector('.modal-postal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// ===== INICIALIZACIÓN =====

// Función principal de inicialización
function inicializarSitio() {
    // Verificar si estamos en la página de inicio
    if (document.getElementById('altar-velitas')) {
        inicializarVelitas();
    }

    if (document.querySelector('.gatitos')) {
        inicializarGatitos();

        // Añadir event listener al botón de compartir mascota
        const btnCompartir = document.querySelector('.btn-gatitos');
        if (btnCompartir) {
            btnCompartir.addEventListener('click', compartirMascota);
        }
    }

    if (document.querySelector('.conversaciones')) {
        inicializarConversaciones();

        // Añadir event listener al botón de escribir mensaje
        const btnEscribir = document.querySelector('.btn-conversaciones');
        if (btnEscribir) {
            btnEscribir.addEventListener('click', escribirMensaje);
        }
    }

    // Configurar cards del rincón de paz
    const cardsRincon = document.querySelectorAll('.card-rincon');
    cardsRincon.forEach(card => {
        card.addEventListener('click', mostrarPostalAleatoria);
        card.style.cursor = 'pointer';
    });

    // Mostrar postal aleatoria cada 30 segundos
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% de probabilidad
            mostrarPostalAleatoria();
        }
    }, 30000);
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarSitio);

// ===== EFECTOS ESPECIALES =====

// Efecto de partículas sutiles (opcional)
function crearParticulasAmor() {
    const particula = document.createElement('div');
    particula.innerHTML = Math.random() > 0.5 ? '🐾' : '💙';
    particula.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 100;
        font-size: 20px;
        left: ${Math.random() * 100}%;
        top: 100%;
        animation: floatUp 4s ease-out forwards;
        opacity: 0.6;
    `;

    document.body.appendChild(particula);

    // Remover después de la animación
    setTimeout(() => {
        particula.remove();
    }, 4000);
}

// Añadir CSS para animación de partículas
const stylePartículas = document.createElement('style');
stylePartículas.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(stylePartículas);

// Crear partículas ocasionalmente
setInterval(crearParticulasAmor, 10000); // Cada 10 segundos

// ===== FUNCIONES GLOBALES =====

// Hacer funciones disponibles globalmente
window.encenderVelita = encenderVelita;
window.compartirMascota = compartirMascota;
window.escribirMensaje = escribirMensaje;
window.mostrarPostalAleatoria = mostrarPostalAleatoria;
window.cerrarPostal = cerrarPostal;
