
let vistaAlimento;
let vistaBebida;
let vistaCombo;

function cargarVistaAlimento() {
    fetch("menu/vista-alimento.html")
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            document.getElementById("contenedorPrincipal").innerHTML = html;
            import("../../menu/funciones-menu.js").then(function (controller) {
                vistaAlimento = controller;
                actualizarComanda();
                actualizarTarjetasAlimentos(); // Llama aquí
            });
        })
        .catch(error => console.error('Error al cargar vista de alimento:', error));
}

function cargarVistaBebida() {
    fetch("menu/vista-bebida.html")
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            document.getElementById("contenedorPrincipal").innerHTML = html;
            import("../../menu/funciones-menu.js").then(function (controller) {
                vistaBebida = controller;
                actualizarComanda();
                actualizarTarjetasBebidas(); // Llama aquí
            });
        })
        .catch(error => console.error('Error al cargar vista de bebida:', error));
}

function cargarVistaCombo() {
    fetch("menu/vista-combo.html")
            .then(
                    function (response) {
                        return response.text();
                    }
            )
            .then(
                    function (html) {
                        document.getElementById("contenedorPrincipal").innerHTML = html;
                        import("../../menu/funciones-menu.js").then(
                                function (controller) {
                                    vistaCombo = controller;
                                }
                        );
                    }
            );
}