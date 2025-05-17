let refreshInterval = null;
const tiempoDesocuparModulo = 5000; // 5 segundos
let autoTurnoActivo = false;
let autoTurnoInterval = null;
let ultimoTurnoGenerado = 0;

// Actualizar fecha y hora en tiempo real
function actualizarFechaHora() {
    const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-ES', opciones);
    const hora = ahora.toLocaleTimeString('es-ES');

    document.getElementById('fecha-hora').innerHTML = `
        Día y Hora: ${fecha} | ${hora}
    `;
}



function getComanda() {
    const ruta = `http://localhost:8080/Zarape/api/comanda/getAllComandaGeneral`;
    const requestOptions = {method: 'GET'};

    fetch(ruta, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error('La respuesta no es un array:', data);
                    Swal.fire('Error', 'La respuesta del servidor no es válida.', 'error');
                    return;
                }

                const contenedor = document.getElementById('modulos-container');
                contenedor.innerHTML = ''; // Limpiar solo el contenedor de las comandas

                const agrupadas = data.reduce((acc, comanda) => {
                    acc[comanda.idComanda] = acc[comanda.idComanda] || [];
                    acc[comanda.idComanda].push(comanda);
                    return acc;
                }, {});

                Object.entries(agrupadas).forEach(([idComanda, comandas]) => {
                    const comanda = comandas[0];

                    // Asignar color según el estatus
                    let colorEstatus = {
                        "Proceso": "#7b5900",
                        "Terminado": "green",
                        "Entregado": "blue",
                        "Cancelado": "darkgray"
                    }[comanda.estatus] || "gray"; // Color por defecto

                    const card = document.createElement('div');
                    card.classList.add('col-md-4', 'mb-4');
                    card.innerHTML = `
                        <div class="card" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div class="card-header" style="background-color: ${colorEstatus}; color: white; font-size: 1.5em; text-align: center; padding: 12px;">
                                <span><strong>Ticket #: ${comanda.ticket?.idTicket || 'N/A'}</strong></span><br><p>-----------</p>
                                <strong>Fecha y Hora: ${comanda.fechaHoraRegistro}</strong><br>
                            </div>
                            <div class="card-body" style="padding: 15px;">
                                
                                <h4 style="font-size: 1.3em; text-align: center; margin: 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                                    <strong>Estatus: ${comanda.estatus}</strong>
                                </h4>
                                
                            </div>
                        </div>
                    `;

                    contenedor.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error al cargar las comandas:', error);
                Swal.fire('Error', 'Hubo un problema al cargar las comandas.', 'error');
            });
}

window.onload = function () {

    startAutoRefresh();
}

function startAutoRefresh() {
    // Limpiar intervalo anterior si existe
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }

    // Cargar datos inmediatamente
    getComanda();

    // Configurar nuevo intervalo
    refreshInterval = setInterval(() => {
        getComanda();
    }, 5000);

    refreshInterval = setInterval(() => {
        actualizarFechaHora();
    }, 1000);
}

function logout() {
    // Limpiar intervalos de actualización
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }

    if (autoTurnoInterval) {
        clearInterval(autoTurnoInterval);
        autoTurnoInterval = null;
    }

    // Elimina el token y el nombre del usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Redirige al usuario a la página de inicio de sesión
    window.location.href = '../index.html';
}