// ==========================================
// AUDIO DE INSTRUCCIONES - MEMORAMA MAGICO
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const botonEscuchar = document.getElementById("escuchar");
    const botonDetener = document.getElementById("detener");
    const estadoAudio = document.getElementById("estado-audio");

    const instrucciones = `
        Bienvenido a Memorama Mágico.
        Para comenzar, selecciona una categoría.
        Después, elige la dificultad del juego.
        Presiona una tarjeta para descubrirla.
        Luego selecciona otra tarjeta para encontrar su pareja.
        Si las dos tarjetas coinciden, habrás encontrado una pareja.
        Si no coinciden, se voltearán nuevamente.
        Puedes utilizar las pistas para recibir ayuda.
        Encuentra todas las parejas para ganar.
        ¡Diviértete y demuestra tu memoria!
    `;

    if (!botonEscuchar || !botonDetener || !estadoAudio) {
        console.error("No se encontraron los botones de audio del menú.");
        return;
    }

    if (!("speechSynthesis" in window)) {
        estadoAudio.textContent =
            "Tu navegador no permite reproducir instrucciones por voz.";

        botonEscuchar.disabled = true;
        return;
    }

    botonEscuchar.addEventListener("click", function () {

        window.speechSynthesis.cancel();

        const lectura = new SpeechSynthesisUtterance(instrucciones);

        lectura.lang = "es-MX";
        lectura.rate = 0.85;
        lectura.pitch = 1.1;
        lectura.volume = 1;

        lectura.onstart = function () {
            estadoAudio.textContent = "🔊 Escuchando instrucciones...";
        };

        lectura.onend = function () {
            estadoAudio.textContent = "✅ ¡Terminaste de escuchar!";
        };

        lectura.onerror = function (evento) {
            estadoAudio.textContent =
                "No se pudo reproducir el audio. Intenta nuevamente.";

            console.error("Error de voz:", evento.error);
        };

        window.speechSynthesis.speak(lectura);
    });

    botonDetener.addEventListener("click", function () {

        window.speechSynthesis.cancel();

        estadoAudio.textContent = "⏹ Audio detenido.";
    });

});