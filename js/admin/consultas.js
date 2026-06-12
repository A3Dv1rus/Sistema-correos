const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}
let consultasOriginales = [];
cargarConsultas();
async function cargarConsultas() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/consultas",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const consultas = await response.json();
        consultasOriginales = consultas;
        mostrarConsultas(consultasOriginales);
    }
    catch (error) {
        console.error(error);
        alert("Error al cargar las consultas");
    }
}
function mostrarConsultas(consultas) {
    const tabla =document.getElementById("tablaConsultas");
    tabla.innerHTML = "";
    consultas.forEach(consulta => {
        let estado = "";
        let color = "";
        switch (consulta.estado_consulta_id) {
            case 1:
                estado = "Pendiente";
                color = "warning";
                break;
            case 2:
                estado = "Respondida";
                color = "success";
                break;
            case 3:
                estado = "Cerrada";
                color = "secondary";
                break;
            default:
                estado = "Desconocido";
                color = "dark";
        }
        tabla.innerHTML += `
            <tr>
                <td>
                    <strong>#${consulta.id}</strong>
                </td>
                <td>
                    <strong>
                        ${consulta.usuario?.nombre ?? "-"}
                    </strong>
                    <br>
                    <small class="text-muted">
                        ${consulta.usuario?.email ?? "-"}
                    </small>
                </td>
                <td>
                    ${consulta.asunto}
                </td>
                <td>
                    ${consulta.mensaje}
                </td>
                <td>
                    ${
                        consulta.respuesta ? consulta.respuesta : '<span class="text-muted">Sin respuesta</span>'
                    }
                </td>
                <td>
                    <span class="badge bg-${color}">
                        ${estado}
                    </span>
                </td>
                <td>

                    ${
                        consulta.estado_consulta_id == 1 ?
                        `
                        <button
                            class="btn btn-success btn-sm"
                            onclick="responderConsulta(${consulta.id})">
                            <i class="bi bi-check-circle"></i>
                            Responder
                        </button>
                        `
                        :
                        `
                        <span class="text-success">
                            Atendida
                        </span>
                        `
                    }
                </td>
            </tr>
        `;
    });
}
async function responderConsulta(id) {
    const respuesta = prompt("Escriba la respuesta:");
    if (!respuesta) {
        return;
    }
    try {
        const response =
            await fetch(
                `http://127.0.0.1:8000/api/consultas/${id}/responder`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        respuesta: respuesta,
                        estado_consulta_id: 2
                    })
                }
            );
        if (response.ok) {
            alert( "Consulta respondida correctamente");
            cargarConsultas();
        }
        else {
            alert("No se pudo responder la consulta");
        }
    }
    catch (error) {
        console.error(error);
        alert("Error al responder");
    }
}

function filtrarConsultas() {
    const estadoSeleccionado = document.getElementById("filtroEstado").value;
    let consultasFiltradas = consultasOriginales;
    if (estadoSeleccionado != "0") {
        consultasFiltradas = consultasOriginales.filter( consulta => consulta.estado_consulta_id == estadoSeleccionado);
    }

    mostrarConsultas( consultasFiltradas);
}