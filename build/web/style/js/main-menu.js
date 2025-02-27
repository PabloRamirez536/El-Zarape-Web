
let vistaAlimento;
let vistaBebida;
let vistaCombo;

function cargarVistaAlimento() {
    fetch("menu/vista-alimento.html")
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
                                    vistaAlimento = controller;
                                }
                        );
                    }
            );
    actualizarTarjetasAlimentos();
}
function cargarVistaBebida() {
    fetch("menu/vista-bebida.html")
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
                                    vistaBebida = controller;
                                }
                        );
                    }
            );
    actualizarTarjetasBebidas();
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