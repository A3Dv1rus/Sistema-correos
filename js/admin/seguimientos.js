const API_URL ="http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");
if (!token) {
    window.location.href ="../index.html";
}
let seguimientosGlobal = [];
cargarSeguimientos();
async function cargarSeguimientos() {
    try {
        const response = await fetch(
                `${API_URL}/seguimientos`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        if (!response.ok) {
            throw new Error("Error al obtener seguimientos");
        }
        const data =await response.json();
        seguimientosGlobal =data;
        renderizarTabla(seguimientosGlobal);
    }
    catch(error) {
        console.error(error);
        alert("No se pudieron cargar los seguimientos");
    }
}
function renderizarTabla(seguimientos) {
    const tabla =document.getElementById("tablaSeguimientos");
    tabla.innerHTML = "";
    seguimientos.forEach(
        seguimiento => {
            tabla.innerHTML += `
            <tr>
                <td>
                    <span class="badge bg-secondary">
                        #${seguimiento.id}
                    </span>
                </td>
                <td>
                    ${
                        seguimiento.paquete?.codigo_seguimiento?? "-"
                    }
                </td>
                <td>
                    ${
                        seguimiento.paquete?.titulo?? "-"
                    }
                </td>
                <td>
                    ${crearBadgeEstado(seguimiento.estado_seguimiento_id)}
                </td>
                <td>
                    ${seguimiento.ubicacion}
                </td>
                <td>
                    ${
                        seguimiento.observacion?? "-"
                    }
                </td>
                <td>
                    ${formatearFecha( seguimiento.fecha_hora)}
                </td>
            </tr>
            `;
        });
}
function crearBadgeEstado(estado) {
    switch(estado) {
        case 1:
            return `
            <span class="badge bg-primary">
                Registrado
            </span>`;
        case 2:
            return `
            <span class="badge bg-info">
                En Tránsito
            </span>`;
        case 3:
            return `
            <span class="badge bg-warning text-dark">
                En Sucursal
            </span>`;
        case 4:
            return `
            <span class="badge bg-secondary">
                En Reparto
            </span>`;
        case 5:
            return `
            <span class="badge bg-success">
                Entregado
            </span>`;
        case 6:
            return `
            <span class="badge bg-danger">
                Cancelado
            </span>`;
        default:
            return `
            <span class="badge bg-dark">
                Desconocido
            </span>`;
    }
}
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString("es-BO");
}
document.getElementById("buscarSeguimiento").addEventListener("input",function () {
            const texto =this.value.toLowerCase();
            const filtrados =seguimientosGlobal.filter( s =>(s.paquete ?.codigo_seguimiento ?? "").toLowerCase().includes(texto) || (s.ubicacion ?? "").toLowerCase().includes(texto));
            renderizarTabla(filtrados);
        });