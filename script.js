/* =========================================
   MEMORAMA MAGICO
   FIGURAS GEOMETRICAS Y SUS NOMBRES
========================================= */

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

const botonPista = document.getElementById("pista");
const botonBarajar = document.getElementById("barajar");
const botonPausar = document.getElementById("pausar");
const botonSonido = document.getElementById("sonido");
const botonTema = document.getElementById("tema");
const botonReiniciar = document.getElementById("reiniciar");
const botonOtraPartida = document.getElementById("jugar-otra-vez");

const resultado = document.getElementById("resultado");
const textoPistas = document.getElementById("pistas-restantes");

// FIGURAS GEOMETRICAS

const figuras = [
    { id: 1, nombre: "CÍRCULO", dibujo: "●", color: "#ef4444" },
    { id: 2, nombre: "TRIÁNGULO", dibujo: "▲", color: "#f97316" },
    { id: 3, nombre: "CUADRADO", dibujo: "■", color: "#2563eb" },
    { id: 4, nombre: "RECTÁNGULO", dibujo: "▬", color: "#16a34a" },
    { id: 5, nombre: "ROMBO", dibujo: "◆", color: "#9333ea" },
    { id: 6, nombre: "ESTRELLA", dibujo: "★", color: "#eab308" },
    { id: 7, nombre: "CORAZÓN", dibujo: "♥", color: "#ec4899" },
    { id: 8, nombre: "ÓVALO", dibujo: "⬭", color: "#0891b2" },
    { id: 9, nombre: "PENTÁGONO", dibujo: "⬠", color: "#7c3aed" },
    { id: 10, nombre: "HEXÁGONO", dibujo: "⬡", color: "#0d9488" },
    { id: 11, nombre: "CRUZ", dibujo: "✚", color: "#dc2626" },
    { id: 12, nombre: "LUNA", dibujo: "☾", color: "#6366f1" },
    { id: 13, nombre: "FLECHA", dibujo: "➤", color: "#ea580c" },
    { id: 14, nombre: "TRAPECIO", dibujo: "⏢", color: "#059669" },
    { id: 15, nombre: "PARALELOGRAMO", dibujo: "▱", color: "#7c3aed" },
    { id: 16, nombre: "CILINDRO", dibujo: "🛢️", color: "#0284c7" },
    { id: 17, nombre: "CUBO", dibujo: "▣", color: "#be123c" },
    { id: 18, nombre: "DIAMANTE", dibujo: "💎", color: "#0891b2" }
];

// VARIABLES DEL JUEGO

let seleccionadas = [];
let cartasCorrectas = 0;
let movimientos = 0;
let puntuacion = 0;
let racha = 0;
let segundos = 0;

let pistas = 3;
let mezclas = 3;
let totalParejas = 8;

let bloqueo = false;
let pausado = false;
let sonidoActivo = true;
let juegoTerminado = false;

let intervalo = null;

// ACTUALIZAR CONTADOR DE PISTAS

function actualizarPistas() {
    if (textoPistas) {
        textoPistas.textContent =
            `💡 Pistas disponibles: ${pistas}`;
    }

    if (botonPista) {
        botonPista.disabled = pistas <= 0;
    }
}

// MEZCLAR ARREGLOS

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

    const AudioContext =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) return;

    const audio = new AudioContext();
    const oscilador = audio.createOscillator();
    const volumen = audio.createGain();

    oscilador.connect(volumen);
    volumen.connect(audio.destination);

    oscilador.frequency.value = frecuencia;
    volumen.gain.value = 0.08;

    oscilador.start();

    volumen.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.2
    );

    oscilador.stop(audio.currentTime + 0.2);
}

// CREAR CARTA

function crearCarta(figura, tipo) {
    const tarjeta = document.createElement("button");

    tarjeta.type = "button";
    tarjeta.className = "tarjeta";

    tarjeta.dataset.figura = figura.id;
    tarjeta.dataset.tipo = tipo;

    const contenido = document.createElement("div");
    contenido.className = "tarjeta-interior";

    const reverso = document.createElement("div");
    reverso.className = "cara reverso";
    reverso.textContent = "?";

    const frente = document.createElement("div");
    frente.className = "cara frente";

    if (tipo === "figura") {
        const dibujo = document.createElement("span");

        dibujo.className = "figura-icono";
        dibujo.textContent = figura.dibujo;
        dibujo.style.color = figura.color;

        frente.appendChild(dibujo);
    } else {
        const nombre = document.createElement("span");

        nombre.className = "figura-nombre";
        nombre.textContent = figura.nombre;

        frente.appendChild(nombre);
    }

    contenido.appendChild(reverso);
    contenido.appendChild(frente);
    tarjeta.appendChild(contenido);

    tarjeta.addEventListener("click", () => {
        seleccionarCarta(tarjeta);
    });

    return tarjeta;
}

// CREAR TABLERO

function crearTablero() {
    tablero.innerHTML = "";

    seleccionadas = [];
    bloqueo = false;
    juegoTerminado = false;

    totalParejas = Number(dificultad.value);

    if (![8, 12, 18].includes(totalParejas)) {
        totalParejas = 8;
    }

    const columnas =
        totalParejas === 8 ? 4 :
        totalParejas === 12 ? 5 : 6;

    tablero.style.setProperty("--columnas", columnas);

    const seleccionFiguras = mezclar(figuras).slice(0, totalParejas);

    let cartas = [];

    seleccionFiguras.forEach(figura => {
        cartas.push({ figura, tipo: "figura" });
        cartas.push({ figura, tipo: "nombre" });
    });

    cartas = mezclar(cartas);

    cartas.forEach(carta => {
        tablero.appendChild(
            crearCarta(carta.figura, carta.tipo)
        );
    });

    actualizarEstadisticas();
    actualizarProgreso();
    actualizarPistas();

    mensajeTurno.textContent =
        "¡Encuentra cada figura con su nombre!";

    resultado.style.display = "none";
}

// SELECCIONAR CARTA

function seleccionarCarta(tarjeta) {
    if (
        bloqueo ||
        pausado ||
        juegoTerminado ||
        tarjeta.classList.contains("volteada") ||
        tarjeta.classList.contains("correcta")
    ) {
        return;
    }

    tarjeta.classList.add("volteada");
    tarjeta.disabled = true;

    seleccionadas.push(tarjeta);

    reproducirSonido(550);

    if (seleccionadas.length === 2) {
        movimientos++;
        comprobarPareja();
    }
}

// COMPROBAR PAREJA

function comprobarPareja() {
    bloqueo = true;

    const [primera, segunda] = seleccionadas;

    const mismaFigura =
        primera.dataset.figura === segunda.dataset.figura;

    const tiposDiferentes =
        primera.dataset.tipo !== segunda.dataset.tipo;

    if (mismaFigura && tiposDiferentes) {
        primera.classList.add("correcta");
        segunda.classList.add("correcta");

        cartasCorrectas++;
        racha++;

        puntuacion += 100 + (racha * 10);

        mensajeTurno.textContent =
            "¡Excelente! Encontraste la pareja.";

        reproducirSonido(850);

        seleccionadas = [];
        bloqueo = false;

        actualizarEstadisticas();
        actualizarProgreso();

        if (cartasCorrectas === totalParejas) {
            finalizarJuego();
        }

    } else {
        racha = 0;
        puntuacion = Math.max(0, puntuacion - 10);

        mensajeTurno.textContent =
            "No coinciden. ¡Inténtalo otra vez!";

        reproducirSonido(250);

        setTimeout(() => {
            primera.classList.remove("volteada");
            segunda.classList.remove("volteada");

            primera.disabled = false;
            segunda.disabled = false;

            seleccionadas = [];
            bloqueo = false;

            actualizarEstadisticas();
        }, 1000);

        actualizarEstadisticas();
    }
}

// ESTADISTICAS

function actualizarEstadisticas() {
    movimientosTexto.textContent = movimientos;

    parejasTexto.textContent =
        `${cartasCorrectas}/${totalParejas}`;

    puntuacionTexto.textContent = puntuacion;
    rachaTexto.textContent = racha;

    const precision = movimientos === 0
        ? 100
        : Math.round((cartasCorrectas / movimientos) * 100);

    precisionTexto.textContent = precision + "%";
}

// PROGRESO

function actualizarProgreso() {
    const porcentaje = Math.round(
        (cartasCorrectas / totalParejas) * 100
    );

    barraProgreso.style.width = porcentaje + "%";
    porcentajeTexto.textContent = porcentaje + "%";
}

// CRONOMETRO

function iniciarTiempo() {
    clearInterval(intervalo);

    intervalo = setInterval(() => {
        if (!pausado && !juegoTerminado) {
            segundos++;
            actualizarTiempo();
        }
    }, 1000);
}

function actualizarTiempo() {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;

    tiempoTexto.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(resto).padStart(2, "0");
}

// UTILIZAR PISTA

function usarPista() {
    if (
        pistas <= 0 ||
        pausado ||
        bloqueo ||
        juegoTerminado ||
        seleccionadas.length > 0
    ) {
        return;
    }

    const cartas = [...tablero.children];
    const parejasDisponibles = [];

    for (let i = 0; i < cartas.length; i++) {
        for (let j = i + 1; j < cartas.length; j++) {
            const a = cartas[i];
            const b = cartas[j];

            if (
                a.dataset.figura === b.dataset.figura &&
                a.dataset.tipo !== b.dataset.tipo &&
                !a.classList.contains("correcta") &&
                !b.classList.contains("correcta")
            ) {
                parejasDisponibles.push([a, b]);
            }
        }
    }

    if (parejasDisponibles.length === 0) return;

    const pareja = parejasDisponibles[
        Math.floor(Math.random() * parejasDisponibles.length)
    ];

    // RESTAR UNA PISTA Y ACTUALIZAR EL TEXTO

    pistas--;
    actualizarPistas();

    bloqueo = true;

    pareja.forEach(carta => {
        carta.classList.add("volteada");
        carta.disabled = true;
    });

    mensajeTurno.textContent = "¡Observa esta pareja!";

    setTimeout(() => {
        pareja.forEach(carta => {
            carta.classList.remove("volteada");
            carta.disabled = false;
        });

        bloqueo = false;

        mensajeTurno.textContent =
            pistas > 0
                ? "¡Sigue buscando las parejas!"
                : "¡Ya no tienes pistas disponibles!";
    }, 1300);
}

// BARAJAR CARTAS

function barajarCartas() {
    if (
        mezclas <= 0 ||
        bloqueo ||
        pausado ||
        juegoTerminado ||
        seleccionadas.length > 0
    ) {
        mensajeTurno.textContent = "No puedes mezclar ahora.";
        return;
    }

    mezclas--;

    const cartas = [...tablero.children];

    const disponibles = cartas.filter(
        carta => !carta.classList.contains("correcta")
    );

    const datos = mezclar(
        disponibles.map(carta => ({
            figura: carta.dataset.figura,
            tipo: carta.dataset.tipo
        }))
    );

    disponibles.forEach((carta, indice) => {
        carta.dataset.figura = datos[indice].figura;
        carta.dataset.tipo = datos[indice].tipo;

        carta.classList.remove("volteada");
        carta.disabled = false;

        const figura = figuras.find(
            f => String(f.id) === datos[indice].figura
        );

        const frente = carta.querySelector(".frente");
        frente.innerHTML = "";

        if (datos[indice].tipo === "figura") {
            const dibujo = document.createElement("span");

            dibujo.className = "figura-icono";
            dibujo.textContent = figura.dibujo;
            dibujo.style.color = figura.color;

            frente.appendChild(dibujo);
        } else {
            const nombre = document.createElement("span");

            nombre.className = "figura-nombre";
            nombre.textContent = figura.nombre;

            frente.appendChild(nombre);
        }
    });

    cartas.forEach(carta => tablero.appendChild(carta));

    mensajeTurno.textContent = "¡Cartas mezcladas!";
}

// PAUSAR JUEGO

function pausarJuego() {
    if (juegoTerminado) return;

    pausado = !pausado;

    botonPausar.textContent =
        pausado ? "Continuar" : "Pausar";

    tablero.style.pointerEvents =
        pausado ? "none" : "auto";

    mensajeTurno.textContent =
        pausado ? "Juego pausado" : "¡Continúa jugando!";
}

// SONIDO

function cambiarSonido() {
    sonidoActivo = !sonidoActivo;

    botonSonido.textContent =
        sonidoActivo ? "Sonido: ON" : "Sonido: OFF";

    if (sonidoActivo) reproducirSonido(600);
}

// MODO OSCURO

function cambiarTema() {
    document.body.classList.toggle("tema-oscuro");

    const oscuro =
        document.body.classList.contains("tema-oscuro");

    botonTema.textContent =
        oscuro ? "Modo claro" : "Modo oscuro";

    localStorage.setItem(
        "temaMemorama",
        oscuro ? "oscuro" : "claro"
    );
}

function cargarTema() {
    const oscuro =
        localStorage.getItem("temaMemorama") === "oscuro";

    document.body.classList.toggle("tema-oscuro", oscuro);

    botonTema.textContent =
        oscuro ? "Modo claro" : "Modo oscuro";
}

// FINALIZAR JUEGO

function finalizarJuego() {
    juegoTerminado = true;
    clearInterval(intervalo);

    mensajeTurno.textContent =
        "¡Felicidades! Completaste el memorama.";

    const recordAnterior = Number(
        localStorage.getItem("recordMemorama") || 0
    );

    if (puntuacion > recordAnterior) {
        localStorage.setItem("recordMemorama", puntuacion);
    }

    recordTexto.textContent =
        Math.max(recordAnterior, puntuacion);

    document.getElementById("total-movimientos").textContent =
        movimientos;

    document.getElementById("tiempo-final").textContent =
        tiempoTexto.textContent;

    document.getElementById("puntuacion-final").textContent =
        puntuacion;

    document.getElementById("precision-final").textContent =
        precisionTexto.textContent;

    resultado.style.display = "block";

    reproducirSonido(1000);
}

// REINICIAR JUEGO

function reiniciarJuego() {
    clearInterval(intervalo);

    movimientos = 0;
    cartasCorrectas = 0;
    puntuacion = 0;
    racha = 0;
    segundos = 0;

    pistas = 3;
    mezclas = 3;

    pausado = false;
    bloqueo = false;
    juegoTerminado = false;
    seleccionadas = [];

    botonPausar.textContent = "Pausar";

    tablero.style.pointerEvents = "auto";

    actualizarTiempo();
    actualizarPistas();

    recordTexto.textContent =
        localStorage.getItem("recordMemorama") || 0;

    crearTablero();
    iniciarTiempo();
}

// EVENTOS DE LOS BOTONES

botonPista.addEventListener("click", usarPista);
botonBarajar.addEventListener("click", barajarCartas);
botonPausar.addEventListener("click", pausarJuego);
botonSonido.addEventListener("click", cambiarSonido);
botonTema.addEventListener("click", cambiarTema);
botonReiniciar.addEventListener("click", reiniciarJuego);
botonOtraPartida.addEventListener("click", reiniciarJuego);

dificultad.addEventListener("change", reiniciarJuego);

// INICIAR JUEGO

cargarTema();

recordTexto.textContent =
    localStorage.getItem("recordMemorama") || 0;

actualizarTiempo();
actualizarPistas();

crearTablero();
iniciarTiempo();