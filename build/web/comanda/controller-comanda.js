let refreshInterval = null;
let currentStatus = null; // Guardará el estatus actual

function cargarVistaTerminado() {
    fetch("vista-terminado.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                document.getElementById("contenedorPrincipal").innerHTML = html;
                import("../comanda/controller-comanda.js").then(function (controller) {
                    startAutoRefresh("Terminado");
                    mostrarBotonesPorEstatus("Terminado");
                });
            })
            .catch(error => console.error('Error al cargar vista de alimento:', error));
}
function cargarVistaEntregado() {
    fetch("vista-entregado.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                document.getElementById("contenedorPrincipal").innerHTML = html;
                import("../comanda/controller-comanda.js").then(function (controller) {
                    startAutoRefresh("Entregado");
                    mostrarBotonesPorEstatus("Entregado");
                });
            })
            .catch(error => console.error('Error al cargar vista de alimento:', error));
}
function cargarVistaCancelado() {
    fetch("vista-cancelado.html")
            .then(function (response) {
                return response.text();
            })
            .then(function (html) {
                document.getElementById("contenedorPrincipal").innerHTML = html;
                import("../comanda/controller-comanda.js").then(function (controller) {
                    startAutoRefresh("Cancelado");
                    mostrarBotonesPorEstatus("Cancelado");
                });
            })
            .catch(error => console.error('Error al cargar vista de alimento:', error));
}
function cargarVistaProceso() {
    startAutoRefresh("Proceso");
    mostrarBotonesPorEstatus("Proceso");
}

function mostrarBotonesPorEstatus(estatus) {
    const botones = {
        "Terminado": document.querySelectorAll('.btnTerminado'),
        "Cancelado": document.querySelectorAll('.btnCancelado'),
        "Proceso": document.querySelectorAll('.btnProceso'),
        "Entregado": document.querySelectorAll('.btnEntregado')
    };

    // Ocultar todos los botones
    Object.values(botones).forEach(buttonGroup => {
        buttonGroup.forEach(button => button.style.display = 'none');
    });

    // Mostrar botones según el estatus
    if (estatus === 'Proceso') {
        botones.Terminado.forEach(button => button.style.display = 'inline-block');
        botones.Cancelado.forEach(button => button.style.display = 'inline-block');
    } else if (estatus === 'Terminado') {
        botones.Entregado.forEach(button => button.style.display = 'inline-block');
    } else if (estatus === 'Cancelado') {
        // Puedes decidir qué hacer si está cancelado
    } else if (estatus === 'Entregado') {
        // Puedes decidir qué hacer si está entregado
    }
}
function getComanda(estatus) {
    const ruta = `http://localhost:8080/Zarape/api/comanda/getAllComanda?estatus=${estatus}`;
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

                const contenedor = document.getElementById('comandas-container');
                contenedor.innerHTML = ''; // Limpiar solo el contenedor de las comandas

                const agrupadas = Object.groupBy(data, comanda => comanda.idComanda);

                Object.entries(agrupadas).forEach(([idComanda, comandas]) => {
                    const comanda = comandas[0];

                    let colorEstatus = {
                        "Proceso": "#7b5900",
                        "Terminado": "green",
                        "Entregado": "blue",
                        "Cancelado": "darkgray"
                    }[comanda.estatus] || "gray";

                    const productosContent = comandas.map(detalle => {
                        const producto = detalle.ticket?.detalleTicket?.producto?.nombre || "Producto desconocido";
                        const cantidad = detalle.ticket?.detalleTicket?.cantidad || 0;
                        return `
                        <div class="producto-item" style="font-size: 1.2em;"> 
                            <span class="producto-nombre">${producto}</span>
                            <label style="font-size: 1.1em;">Cantidad:</label>
                            <input type="text" class="producto-cantidad datos text-center" value="${cantidad}" disabled style="font-size: 1.3em; font-weight: bold;">
                        </div>
                    `;
                    }).join('');
                    document.getElementById('estatusTitle').textContent = comanda.estatus;
                    const card = document.createElement('div');
                    card.classList.add('col-md-4', 'mb-4');
                    card.innerHTML = `
                    <div class="card">
                        <div class="card-header" style="background-color: ${colorEstatus}; color: white; font-size: 1.5em; text-align: center;">
                            <strong>Comanda #${idComanda}</strong> - ${comanda.fechaHoraRegistro} <br>
                            <strong>Estatus:</strong> ${comanda.estatus}
                        </div>
                        <div class="card-body">
                            <h4 style="font-size: 1.5em; text-align: center;"><strong>Productos:</strong></h4><!-- Cambia el tamaño aquí -->
                            ${productosContent}
                            <div class="group-button">
                                <button class="icon-button btnTerminado" style="display: none;" title="Terminado" onclick="cambiarEstatusComanda('${comanda.idComanda}', 'Terminado')">
                                    <img src="../recursos/media/success.png" alt="Icono terminado" class="icon-acciones normal">
                                    <img src="../recursos/media/success.gif" alt="Icono terminado" class="icon-acciones hover">
                                </button>
                                <button class="icon-button btnCancelado" style="display: none;" title="Cancelado" onclick="cambiarEstatusComanda('${comanda.idComanda}', 'Cancelado')">
                                    <img src="../recursos/media/cancelar.png" alt="Icono cancelar" class="icon-acciones normal">
                                    <img src="../recursos/media/cancelar.gif" alt="Icono cancelar" class="icon-acciones hover">
                                </button>
                                <button class="icon-button btnProceso" style="display: none;" title="En proceso" onclick="cambiarEstatusComanda('${comanda.idComanda}', 'Proceso')">
                                    <img src="../recursos/media/proceso.png" alt="Icono proceso" class="icon-acciones normal">            
                                    <img src="../recursos/media/proceso.gif" alt="Icono proceso" class="icon-acciones hover">
                                </button>
                                <button class="icon-button btnEntregado" style="display: none;" title="Entregado" onclick="cambiarEstatusComanda('${comanda.idComanda}', 'Entregado')">
                                    <img src="../recursos/media/entregado.png" alt="Icono entregado" class="icon-acciones normal">                                      
                                    <img src="../recursos/media/entregado.gif" alt="Icono entregado" class="icon-acciones hover">
                                </button>
                            </div>
                        </div>
                    </div>`;

                    contenedor.appendChild(card);
                });
                mostrarBotonesPorEstatus(estatus); // Asegúrate de llamar aquí para mostrar los botones adecuados
            })
            .catch(error => {
                console.error('Error al cargar las comandas:', error);
                Swal.fire('Error', 'Hubo un problema al cargar las comandas.', 'error');
            });
}

function cambiarEstatusComanda(idComanda, nuevoEstatus) {
    const url = 'http://localhost:8080/Zarape/api/comanda/updateEstatus'; // URL de la API para actualizar el estado

    const datosComanda = {
        idComanda: idComanda,
        estatus: nuevoEstatus // Nuevo estado a actualizar
    };
    let params = {
        datosComanda: JSON.stringify(datosComanda)
    };
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams(params)
    };

    // Realizamos la llamada a la API para actualizar el estatus
    fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el estado de la comanda');
                }
                return response.json();
            })
            .then(data => {
                console.log('Estado actualizado correctamente:', data);
                Swal.fire('Comanda actualizada', 'El estado de la comanda ha sido actualizado', 'success');

                getComanda(currentStatus);
            })
            .catch(error => {
                console.error('Error al actualizar el estado:', error);
                Swal.fire('Error', 'Hubo un problema al actualizar el estado de la comanda.', 'error');
            });
}

function startAutoRefresh(status) {
    // Limpiar intervalo anterior si existe
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }

    // Guardar el estatus actual
    currentStatus = status;

    // Cargar datos inmediatamente
    getComanda(status);

    // Configurar nuevo intervalo
    refreshInterval = setInterval(() => {
        getComanda(currentStatus);
    }, 5000);
}
function logout() {
    const username = localStorage.getItem('username');

    if (username) {
        // Llama al endpoint para cerrar sesión en el servidor
        fetch(`http://localhost:8080/Zarape/api/usuario/logout?nombreU=${encodeURIComponent(username)}`, {
            method: 'GET',
        })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        console.log(data.message);
                    } else if (data.error) {
                        console.error(data.error);
                    }

                    // Elimina el token y el nombre del usuario del localStorage
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');

                    // Redirige al usuario a la página de inicio de sesión
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    console.error('Error al cerrar sesión:', error);
                });
    } else {
        console.error('No hay usuario en sesión.');
    }
}