/*Copyright 2024*/
document.addEventListener("DOMContentLoaded", function() {
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
 



