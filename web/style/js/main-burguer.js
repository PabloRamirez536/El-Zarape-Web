/*Copyright 2024*/
document.addEventListener("DOMContentLoaded", function () {
    function loadMenu() {
        fetch('../../modulos/burguer.html')
                .then(response => response.text())
                .then(data => {
                    document.querySelector('#menu-container').innerHTML = data;

                    const hamburguer = document.querySelector('.hamburguer');
                    const menu = document.querySelector('.menu-navegacion');

                    hamburguer.addEventListener('click', () => {
                        menu.classList.toggle("spread");
                        document.getElementById("cabeza").classList.remove("fixed-top");
                    });

                    window.addEventListener('click', e => {
                        if (menu.classList.contains('spread') && e.target !== menu && e.target !== hamburguer) {
                            menu.classList.remove("spread");
                            document.getElementById("cabeza").classList.add("fixed-top");
                        }
                    });
                })
                .catch(error => console.error('Error al cargar el menú:', error));
    }

    // Llama a la función para cargar el menú
    loadMenu();
});

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
                    window.location.href = '../../index.html';
                })
                .catch((error) => {
                    console.error('Error al cerrar sesión:', error);
                });
    } else {
        console.error('No hay usuario en sesión.');
    }
}


