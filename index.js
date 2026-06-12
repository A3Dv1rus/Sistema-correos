document.addEventListener("DOMContentLoaded",
    iniciar
);
function iniciar() {
    const usuario =JSON.parse(localStorage.getItem( "usuario"));
    const menu = document.getElementById("menuUsuario");
    const nombre =document.getElementById("nombreUsuario");
    if (!usuario) {
        return;
    }
    nombre.textContent =`Hola, ${usuario.nombre}`;
    if (usuario.rol_id == 1) {
        menu.innerHTML = `
            <a href="admin/dashboard.html"
               class="btn btn-light me-2">
                Dashboard
            </a>
            <button
                class="btn btn-danger"
                onclick="logout()">
                Cerrar Sesión
            </button>
        `;
    } else {
        menu.innerHTML = `
            <a href="cliente/mis-paquetes.html"
               class="btn btn-light me-2">
                Mis Paquetes
            </a>
            <a href="cliente/mis-consultas.html"
               class="btn btn-info me-2 text-white">
                Mis Consultas
            </a>
            <button
                class="btn btn-danger"
                onclick="logout()">
                Cerrar Sesión
            </button>
        `;
    }
}
async function logout() {
    const token =localStorage.getItem("token");
    try {
        await fetch(
            "http://127.0.0.1:8000/api/logout",
            {
                method: "POST",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    Accept:
                        "application/json"
                }
            }
        );
    } catch (error) {
        console.error(error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href ="index.html";
}