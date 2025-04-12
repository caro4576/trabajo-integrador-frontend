const listaPersonajes = document.getElementById("listaPersonajes");
const inputBusqueda = document.getElementById("inputBusqueda");
const filtroEstado = document.getElementById("filtroEstado");
const botonAnterior = document.getElementById("botonAnterior");
const botonSiguiente = document.getElementById("botonSiguiente");
const tituloModal = document.getElementById("tituloModal");
const cuerpoModal = document.getElementById("cuerpoModal");

let paginaActual = 1;

async function obtenerPersonajes() {
  const nombre = inputBusqueda.value;
  const estado = filtroEstado.value;
  let url = `https://rickandmortyapi.com/api/character/?page=${paginaActual}`;
  if (nombre) url += `&name=${nombre}`;
  if (estado) url += `&status=${estado}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    mostrarPersonajes(data.results);
    botonAnterior.disabled = !data.info.prev;
    botonSiguiente.disabled = !data.info.next;
  } catch (err) {
    listaPersonajes.innerHTML = '<p class="text-center">No se encontraron personajes.</p>';
    botonAnterior.disabled = true;
    botonSiguiente.disabled = true;
  }
}

function traducirEstado(estado) {
  switch (estado.toLowerCase()) {
    case "alive": return "Vivo";
    case "dead": return "Muerto";
    case "unknown": return "Desconocido";
    default: return estado;
  }
}

function mostrarPersonajes(personajes) {
  listaPersonajes.innerHTML = "";
  personajes.forEach(personaje => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "col-md-3";
    tarjeta.innerHTML = `
      <div class="card bg-secondary text-light h-100" style="cursor:pointer">
        <img src="${personaje.image}" class="card-img-top" alt="${personaje.name}" />
        <div class="card-body text-center">
          <h5>${personaje.name}</h5>
          <p>Estado: ${traducirEstado(personaje.status)}</p>
        </div>
      </div>
    `;
    tarjeta.addEventListener("click", () => mostrarDetalles(personaje));
    listaPersonajes.appendChild(tarjeta);
  });
}

function mostrarDetalles(personaje) {
  tituloModal.textContent = personaje.name;
  cuerpoModal.innerHTML = `
    <img src="${personaje.image}" class="img-fluid mb-3 d-block mx-auto" />
    <p><strong>Estado:</strong> ${traducirEstado(personaje.status)}</p>
    <p><strong>Especie:</strong> ${personaje.species}</p>
    <p><strong>Género:</strong> ${personaje.gender}</p>
    <p><strong>Origen:</strong> ${personaje.origin.name}</p>
  `;
  new bootstrap.Modal(document.getElementById('detailModal')).show();
}

inputBusqueda.addEventListener("input", () => {
  paginaActual = 1;
  obtenerPersonajes();
});

filtroEstado.addEventListener("change", () => {
  paginaActual = 1;
  obtenerPersonajes();
});

botonAnterior.addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    obtenerPersonajes();
  }
});

botonSiguiente.addEventListener("click", () => {
  paginaActual++;
  obtenerPersonajes();
});


obtenerPersonajes();

