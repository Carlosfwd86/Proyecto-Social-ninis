const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

/**
 * Script para el Carrusel de Imágenes
 */
document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    // Función para mostrar una diapositiva específica
    function showSlide(index) {
        // Remover clase active de todas las slides e indicadores
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Asegurar que el índice esté dentro del rango
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // Activar la slide e indicador correspondiente
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // Función para avanzar a la siguiente slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Función para retroceder a la slide anterior
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Auto-play del carrusel
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners para los controles
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay(); // Reiniciar el auto-play
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }

    // Event listeners para los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Pausar auto-play cuando el mouse está sobre el carrusel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Iniciar el carrusel
    startAutoPlay();
});
