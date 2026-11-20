/* ==========================================
   MEMORAMA MAGICO
   SEIS CATEGORIAS Y TRES DIFICULTADES
========================================== */

// ELEMENTOS HTML

const tablero = document.getElementById("tablero");
const dificultad = document.getElementById("dificultad");

const movimientosTexto = document.getElementById("movimientos");
const tiempoTexto = document.getElementById("tiempo");
const parejasTexto = document.getElementById("parejas");
const recordTexto = document.getElementById("record");

const puntuacionTexto = document.getElementById("puntuacion");
const rachaTexto = document.getElementById("racha");
const precisionTexto = document.getElementById("precision");

const barraProgreso = document.getElementById("barra-progreso");
const porcentajeTexto = document.getElementById("porcentaje");

const mensajeTurno = document.getElementById("mensaje-turno");
const pistasTexto = document.getElementById("pistas-restantes");

const resultado = document.getElementById("resultado");

const btnPista = document.getElementById("pista");
const btnBarajar = document.getElementById("barajar");
const btnPausar = document.getElementById("pausar");
const btnSonido = document.getElementById("sonido");
const btnTema = document.getElementById("tema");
const btnReiniciar = document.getElementById("reiniciar");
const btnOtraVez = document.getElementById("jugar-otra-vez");

// CATEGORIA SELECCIONADA

const parametros = new URLSearchParams(window.location.search);

let categoriaActual = parametros.get("categoria") || "figuras";

const nombresCategorias = {
    figuras: "Figuras geométricas",
    animales: "Animales",
    colores: "Colores",
    frutas: "Frutas",
    espacio: "Espacio",
    naturaleza: "Naturaleza"
};

// DATOS DE LAS SEIS CATEGORIAS

const categorias = {

    figuras: [
        ["🔺", "Triángulo"],
        ["🟦", "Cuadrado"],
        ["⚪", "Círculo"],
        ["🔶", "Rombo"],
        ["⭐", "Estrella"],
        ["⬡", "Hexágono"],
        ["❤️", "Corazón"],
        ["🟩", "Rectángulo"],
        ["🌙", "Luna"],
        ["🔻", "Triángulo invertido"],
        ["🟣", "Óvalo"],
        ["💠", "Diamante"],
        ["🔷", "Paralelogramo"],
        ["⬟", "Pentágono"],
        ["🛑", "Octágono"],
        ["🟠", "Elipse"],
        ["✳️", "Estrella de ocho puntas"],
        ["➕", "Cruz"]
    ],

    animales: [
        ["🐶", "Perro"],
        ["🐱", "Gato"],
        ["🐼", "Panda"],
        ["🦁", "León"],
        ["🐸", "Rana"],
        ["🐵", "Mono"],
        ["🐰", "Conejo"],
        ["🦊", "Zorro"],
        ["🐘", "Elefante"],
        ["🦒", "Jirafa"],
        ["🐢", "Tortuga"],
        ["🐬", "Delfín"],
        ["🦋", "Mariposa"],
        ["🐧", "Pingüino"],
        ["🐴", "Caballo"],
        ["🦉", "Búho"],
        ["🐨", "Koala"],
        ["🐳", "Ballena"]
    ],

    colores: [
        ["🔴", "Rojo"],
        ["🔵", "Azul"],
        ["🟡", "Amarillo"],
        ["🟢", "Verde"],
        ["🟣", "Morado"],
        ["🟠", "Naranja"],
        ["⚫", "Negro"],
        ["⚪", "Blanco"],
        ["🩷", "Rosa"],
        ["🟤", "Café"],
        ["🩵", "Celeste"],
        ["🩶", "Gris"],
        ["💚", "Verde claro"],
        ["💙", "Azul marino"],
        ["❤️", "Rojo intenso"],
        ["💜", "Violeta"],
        ["💛", "Dorado"],
        ["🤍", "Marfil"]
    ],

    frutas: [
        ["🍎", "Manzana"],
        ["🍌", "Plátano"],
        ["🍓", "Fresa"],
        ["🍇", "Uvas"],
        ["🍉", "Sandía"],
        ["🍍", "Piña"],
        ["🍊", "Naranja"],
        ["🍒", "Cereza"],
        ["🥝", "Kiwi"],
        ["🥭", "Mango"],
        ["🍑", "Durazno"],
        ["🍐", "Pera"],
        ["🥥", "Coco"],
        ["🍋", "Limón"],
        ["🫐", "Arándano"],
        ["🍈", "Melón"],
        ["🍏", "Manzana verde"],
        ["🍅", "Tomate"]
    ],

    espacio: [
        ["🌎", "Tierra"],
        ["🌙", "Luna"],
        ["☀️", "Sol"],
        ["🪐", "Saturno"],
        ["🚀", "Cohete"],
        ["⭐", "Estrella"],
        ["☄️", "Cometa"],
        ["🌌", "Galaxia"],
        ["👨‍🚀", "Astronauta"],
        ["🛸", "Platillo volador"],
        ["🌑", "Luna nueva"],
        ["🌕", "Luna llena"],
        ["🌠", "Estrella fugaz"],
        ["🔭", "Telescopio"],
        ["🛰️", "Satélite"],
        ["🌟", "Estrella brillante"],
        ["🌞", "Sol brillante"],
        ["🌍", "Planeta azul"]
    ],

    naturaleza: [
        ["🌸", "Flor"],
        ["🌳", "Árbol"],
        ["🌻", "Girasol"],
        ["🌵", "Cactus"],
        ["🍀", "Trébol"],
        ["🌈", "Arcoíris"],
        ["🌊", "Ola"],
        ["🍄", "Hongo"],
        ["🌴", "Palmera"],
        ["🌷", "Tulipán"],
        ["🌿", "Planta"],
        ["🌲", "Pino"],
        ["🌺", "Hibisco"],
        ["🌼", "Margarita"],
        ["☁️", "Nube"],
        ["🔥", "Fuego"],
        ["💧", "Gota de agua"],
        ["🪨", "Roca"]
    ]

};

// VARIABLES DEL JUEGO

let tarjetas = [];
let seleccionadas = [];

let movimientos = 0;
let parejas = 0;
let segundos = 0;
let puntuacion = 0;
let racha = 0;

let pistas = 3;
let totalParejas = 12;

let bloqueo = false;
let pausado = false;
let sonidoActivo = true;
let iniciado = false;
let terminado = false;

let intervalo = null;
let tiempoBloqueo = null;
let contextoAudio = null;

// UTILIDADES

function formatoTiempo(valor) {
    const minutos = Math.floor(valor / 60);
    const segundosRestantes = valor % 60;

    return (
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundosRestantes).padStart(2, "0")
    );
}

function mezclar(array) {
    const copia = [...array];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

// SONIDOS

function reproducirSonido(frecuencia = 500) {
    if (!sonidoActivo) return;

    try {
        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) return;

        if (!contextoAudio) {
            contextoAudio = new AudioContext();
        }

        if (contextoAudio.state === "suspended") {
            contextoAudio.resume();
        }

        const oscilador = contextoAudio.createOscillator();
        const volumen = contextoAudio.createGain();

        oscilador.type = "sine";
        oscilador.frequency.value = frecuencia;

        volumen.gain.setValueAtTime(
            0.08,
            contextoAudio.currentTime
        );

        volumen.gain.exponentialRampToValueAtTime(
            0.001,
            contextoAudio.currentTime + 0.18
        );

        oscilador.connect(volumen);
        volumen.connect(contextoAudio.destination);

        oscilador.start();
        oscilador.stop(contextoAudio.currentTime + 0.18);

    } catch (error) {
        console.log("El sonido no está disponible.");
    }
}

// CRONOMETRO

function iniciarCronometro() {
    if (intervalo || terminado || pausado) return;

    intervalo = setInterval(() => {
        segundos++;

        tiempoTexto.textContent = formatoTiempo(segundos);

    }, 1000);
}

function detenerCronometro() {
    clearInterval(intervalo);
    intervalo = null;
}

// RECORD POR CATEGORIA Y DIFICULTAD

function claveRecord() {
    return `record_${categoriaActual}_${totalParejas}`;
}

function obtenerRecord() {
    try {
        const record = localStorage.getItem(claveRecord());

        if (record === null) {
            return null;
        }

        return Number(record);

    } catch (error) {
        return null;
    }
}

function actualizarRecord() {
    const record = obtenerRecord();

    recordTexto.textContent =
        record === null ? "--:--" : formatoTiempo(record);
}

function guardarRecord() {
    const record = obtenerRecord();

    if (record === null || segundos < record) {
        try {
            localStorage.setItem(claveRecord(), segundos);
        } catch (error) {
            console.log("No se pudo guardar el récord.");
        }
    }

    actualizarRecord();
}

// ACTUALIZAR ESTADISTICAS

function actualizarEstadisticas() {
    movimientosTexto.textContent = movimientos;

    parejasTexto.textContent =
        parejas + " / " + totalParejas;

    puntuacionTexto.textContent = puntuacion;

    rachaTexto.textContent = racha;

    const precision =
        movimientos === 0
            ? 100
            : Math.round((parejas / movimientos) * 100);

    precisionTexto.textContent =
        Math.min(100, precision) + "%";

    const porcentaje =
        Math.round((parejas / totalParejas) * 100);

    porcentajeTexto.textContent = porcentaje + "%";

    barraProgreso.style.width = porcentaje + "%";

    tiempoTexto.textContent = formatoTiempo(segundos);

    pistasTexto.textContent =
        "💡 Pistas disponibles: " + pistas;
}

// CREAR TARJETAS

function crearTarjeta(dato, tipo, id) {

    const tarjeta = document.createElement("button");

    tarjeta.type = "button";
    tarjeta.className = "tarjeta";

    tarjeta.dataset.pareja = id;
    tarjeta.dataset.tipo = tipo;

    tarjeta.setAttribute(
        "aria-label",
        "Tarjeta oculta"
    );

    let contenido = "";

    if (tipo === "visual") {

        if (categoriaActual === "colores") {

            const coloresCSS = {
                "Rojo": "#ef4444",
                "Azul": "#2563eb",
                "Amarillo": "#facc15",
                "Verde": "#16a34a",
                "Morado": "#9333ea",
                "Naranja": "#f97316",
                "Negro": "#111827",
                "Blanco": "#ffffff",
                "Rosa": "#ec4899",
                "Café": "#78350f",
                "Celeste": "#38bdf8",
                "Gris": "#9ca3af",
                "Verde claro": "#86efac",
                "Azul marino": "#1e3a8a",
                "Rojo intenso": "#dc2626",
                "Violeta": "#7c3aed",
                "Dorado": "#eab308",
                "Marfil": "#ffffe0"
            };

            contenido = `
                <span class="muestra-color"
                style="background:${coloresCSS[dato[1]]}">
                </span>
            `;

        } else {

            contenido = `
                <span class="visual-tarjeta">${dato[0]}</span>
            `;
        }

    } else {

        contenido = `
            <span class="nombre-tarjeta">${dato[1]}</span>
        `;
    }

    tarjeta.innerHTML = `
        <div class="tarjeta-interior">

            <div class="cara-frontal">
                ?
            </div>

            <div class="cara-trasera">
                ${contenido}
            </div>

        </div>
    `;

    tarjeta.addEventListener("click", () => {
        seleccionarTarjeta(tarjeta);
    });

    return tarjeta;
}

// GENERAR TABLERO

function generarTablero() {

    tablero.innerHTML = "";

    const datos = categorias[categoriaActual] || categorias.figuras;

    const seleccion = mezclar(datos).slice(0, totalParejas);

    let mazo = [];

    seleccion.forEach((dato, indice) => {

        mazo.push({
            dato: dato,
            tipo: "visual",
            id: indice
        });

        mazo.push({
            dato: dato,
            tipo: "nombre",
            id: indice
        });

    });

    mazo = mezclar(mazo);

    mazo.forEach(elemento => {

        const tarjeta = crearTarjeta(
            elemento.dato,
            elemento.tipo,
            elemento.id
        );

        tablero.appendChild(tarjeta);

    });

}

// SELECCIONAR TARJETAS

function seleccionarTarjeta(tarjeta) {

    if (
        bloqueo ||
        pausado ||
        terminado ||
        tarjeta.classList.contains("volteada") ||
        tarjeta.classList.contains("encontrada")
    ) {
        return;
    }

    if (!iniciado) {
        iniciado = true;
        iniciarCronometro();
    }

    tarjeta.classList.add("volteada");

    tarjeta.setAttribute(
        "aria-label",
        "Tarjeta descubierta"
    );

    reproducirSonido(550);

    seleccionadas.push(tarjeta);

    if (seleccionadas.length === 2) {

        movimientos++;

        bloqueo = true;

        comprobarPareja();
    }

    actualizarEstadisticas();
}

// COMPROBAR PAREJAS

function comprobarPareja() {

    const primera = seleccionadas[0];
    const segunda = seleccionadas[1];

    if (primera.dataset.pareja === segunda.dataset.pareja) {

        primera.classList.add("encontrada");
        segunda.classList.add("encontrada");

        primera.disabled = true;
        segunda.disabled = true;

        parejas++;
        racha++;

        puntuacion += 100 + (racha * 10);

        mensajeTurno.textContent =
            "🎉 ¡Excelente! Encontraste una pareja.";

        reproducirSonido(800);

        seleccionadas = [];
        bloqueo = false;

        actualizarEstadisticas();

        if (parejas === totalParejas) {
            finalizarJuego();
        }

    } else {

        racha = 0;

        puntuacion = Math.max(0, puntuacion - 10);

        mensajeTurno.textContent =
            "❌ No coinciden. ¡Inténtalo otra vez!";

        actualizarEstadisticas();

        tiempoBloqueo = setTimeout(() => {

            if (pausado) {
                return;
            }

            primera.classList.remove("volteada");
            segunda.classList.remove("volteada");

            primera.setAttribute("aria-label", "Tarjeta oculta");
            segunda.setAttribute("aria-label", "Tarjeta oculta");

            seleccionadas = [];
            bloqueo = false;

            mensajeTurno.textContent =
                "Selecciona tu siguiente pareja.";

        }, 900);
    }
}

// FINALIZAR JUEGO

function finalizarJuego() {

    terminado = true;

    detenerCronometro();

    guardarRecord();

    document.getElementById("total-movimientos").textContent =
        movimientos;

    document.getElementById("tiempo-final").textContent =
        formatoTiempo(segundos);

    document.getElementById("puntuacion-final").textContent =
        puntuacion;

    document.getElementById("precision-final").textContent =
        precisionTexto.textContent;

    mensajeTurno.textContent =
        "🏆 ¡Has encontrado todas las parejas!";

    resultado.classList.remove("oculto");

    resultado.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    reproducirSonido(950);
}

// PISTAS

function usarPista() {

    if (pausado || terminado || bloqueo || pistas <= 0) {
        return;
    }

    const disponibles = [...tablero.querySelectorAll(".tarjeta")]
        .filter(t =>
            !t.classList.contains("encontrada") &&
            !t.classList.contains("volteada")
        );

    const primera = disponibles[0];

    if (!primera) return;

    const parejaDisponible = disponibles.find(t =>
        t.dataset.pareja === primera.dataset.pareja &&
        t !== primera
    );

    if (!parejaDisponible) return;

    pistas--;

    puntuacion = Math.max(0, puntuacion - 25);

    bloqueo = true;

    primera.classList.add("volteada");
    parejaDisponible.classList.add("volteada");

    mensajeTurno.textContent =
        "💡 ¡Aquí está una pareja!";

    actualizarEstadisticas();

    reproducirSonido(700);

    tiempoBloqueo = setTimeout(() => {

        if (pausado) return;

        primera.classList.remove("volteada");
        parejaDisponible.classList.remove("volteada");

        seleccionadas = [];
        bloqueo = false;

        mensajeTurno.textContent =
            "Continúa buscando las parejas.";

    }, 1200);
}

// PAUSAR Y CONTINUAR

function cambiarPausa() {

    if (terminado) return;

    pausado = !pausado;

    if (pausado) {

        detenerCronometro();

        btnPausar.textContent = "▶️ Continuar";

        mensajeTurno.textContent =
            "⏸️ Juego pausado.";

        tablero.querySelectorAll(".tarjeta").forEach(t => {
            t.style.pointerEvents = "none";
        });

    } else {

        if (iniciado) iniciarCronometro();

        btnPausar.textContent = "⏸️ Pausar";

        mensajeTurno.textContent =
            "¡Continúa jugando!";

        tablero.querySelectorAll(".tarjeta").forEach(t => {
            t.style.pointerEvents = "";
        });

        if (tiempoBloqueo) {
            clearTimeout(tiempoBloqueo);
            tiempoBloqueo = null;

            seleccionadas.forEach(t => {
                t.classList.remove("volteada");
            });

            seleccionadas = [];
            bloqueo = false;
        }
    }
}

// SONIDO

function cambiarSonido() {

    sonidoActivo = !sonidoActivo;

    btnSonido.textContent = sonidoActivo
        ? "🔊 Sonido"
        : "🔇 Sonido apagado";

    if (sonidoActivo) reproducirSonido(600);
}

// MODO OSCURO

function cambiarTema() {

    document.body.classList.toggle("tema-oscuro");

    const oscuro = document.body.classList.contains("tema-oscuro");

    btnTema.textContent = oscuro
        ? "☀️ Modo claro"
        : "🌙 Modo oscuro";
}

// REINICIAR PARTIDA

function reiniciarJuego() {

    detenerCronometro();

    clearTimeout(tiempoBloqueo);
    tiempoBloqueo = null;

    movimientos = 0;
    parejas = 0;
    segundos = 0;
    puntuacion = 0;
    racha = 0;

    pistas = 3;

    seleccionadas = [];

    bloqueo = false;
    pausado = false;
    iniciado = false;
    terminado = false;

    btnPausar.textContent = "⏸️ Pausar";

    resultado.classList.add("oculto");

    mensajeTurno.textContent =
        "Selecciona tu primera tarjeta.";

    actualizarRecord();

    generarTablero();

    actualizarEstadisticas();
}

// EVENTOS DE BOTONES

btnPista.addEventListener("click", usarPista);

btnBarajar.addEventListener("click", reiniciarJuego);

btnPausar.addEventListener("click", cambiarPausa);

btnSonido.addEventListener("click", cambiarSonido);

btnTema.addEventListener("click", cambiarTema);

btnReiniciar.addEventListener("click", reiniciarJuego);

btnOtraVez.addEventListener("click", reiniciarJuego);

// CAMBIAR DIFICULTAD

dificultad.addEventListener("change", () => {

    totalParejas = Number(dificultad.value);

    reiniciarJuego();

});

// INICIAR EL JUEGO

document.addEventListener("DOMContentLoaded", () => {

    totalParejas = Number(dificultad.value);

    const titulo = document.getElementById("nombre-categoria");

    if (titulo) {
        titulo.textContent =
            "✨ " + (nombresCategorias[categoriaActual] || nombresCategorias.figuras);
    }

    actualizarRecord();

    generarTablero();

    actualizarEstadisticas();

});
