const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}
const usuario = JSON.parse(
    localStorage.getItem("usuario")
);
if (usuario) {
    document.getElementById(
        "usuarioNombre"
    ).textContent = usuario.nombre;
}
document.getElementById(
    "fechaActual"
).textContent =
    new Date().toLocaleDateString(
        "es-BO",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
cargarDashboard();
async function cargarDashboard() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        document.getElementById("usuarios").textContent =data.usuarios;
        document.getElementById("paquetes").textContent =data.paquetes;
        document.getElementById("consultasPendientes").textContent =data.consultas_pendientes;
        document.getElementById("registrados").textContent = data.seguimientos_registrados;
        document.getElementById("transito").textContent = data.seguimientos_transito;
        document.getElementById("reparto").textContent =data.seguimientos_reparto;
        document.getElementById("entregados").textContent =data.seguimientos_entregados;
    } catch (error) {
        console.error(error);
        alert("Error al cargar dashboard");
    }
}
async function logout() {
    try {
        const token =
            localStorage.getItem("token");
        await fetch(
            "http://127.0.0.1:8000/api/logout",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    } catch (error) {
        console.error(error);
    }
    localStorage.clear();
    window.location.href = "/index.html";
}