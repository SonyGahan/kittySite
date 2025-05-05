// Observador de intersección para efectos de aparición
document.addEventListener("DOMContentLoaded", function () {
    const faders = document.querySelectorAll('.fade-in-section');

    // Configuración del observador - Buenos valores por defecto
    const appearOptions = {
        threshold: 0.1,  // 10% del elemento visible
        rootMargin: "0px 0px -100px 0px"  // Margen negativo para activar antes
    };

    // Callback del observador - Bien implementado
    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);  // Deja de observar después de aparecer
        });
    }, appearOptions);

    // Observar todos los elementos con la clase fade-in-section
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Sugerencia: Podríamos añadir funcionalidad para las velitas
    // Ejemplo básico:
    const crearVelita = () => {
        const vela = document.createElement('div');
        vela.className = 'vela';
        vela.innerHTML = '<div class="llama"></div>';
        vela.addEventListener('click', () => {
            vela.classList.toggle('encendida');
        });
        return vela;
    };

    // Inicializar velitas si existe el contenedor
    const altarVelitas = document.getElementById('altar-velitas');
    if (altarVelitas) {
        for (let i = 0; i < 20; i++) {
            altarVelitas.appendChild(crearVelita());
        }
    }

    const img = new Image();
    img.src = './assets/img/fondoKitty.jpg';
    
    img.onload = () => console.log('✅ Imagen existe y se cargó');
    img.onerror = () => console.log('❌ Error al cargar la imagen');

});

// Sugerencia: Podríamos separar en módulos según funcionalidades
// Ejemplo: scripts.js (principal), velitas.js, galeria.js, etc.