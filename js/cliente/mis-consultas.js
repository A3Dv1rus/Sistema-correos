const API_URL = "http://127.0.0.1:8000/api";
document.addEventListener("DOMContentLoaded",
    iniciar
);
async function iniciar() {
    const usuario =
        JSON.parse(
            localStorage.getItem( "usuario")
        );
    if (!usuario) {
        window.location.href = "../login.html";
        return;
    }
    await cargarConsultas();
    document.getElementById("formConsulta").addEventListener("submit",crearConsulta);
}
async function cargarConsultas() {
    try {
        const token =
            localStorage.getItem( "token" );
        const response =
            await fetch(
                `${API_URL}/consultas`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        const consultas =await response.json();
        mostrarConsultas(consultas);
    } catch(error){
        console.error(error);
    }
}
function mostrarConsultas(consultas){
    const tabla = document.getElementById("tablaConsultas");
    tabla.innerHTML = "";
    consultas.forEach(
        consulta => {
            let estadoTexto ="Pendiente";
            let claseEstado ="estado-pendiente";
            if(consulta.estado_consulta_id == 2){
                estadoTexto = "Respondida";
                claseEstado = "estado-respondida";
            }
            if(consulta.estado_consulta_id == 3){
                estadoTexto ="Cerrada";
                claseEstado ="estado-cerrada";
            }
            tabla.innerHTML += `
                <tr>
                    <td>
                        ${consulta.id}
                    </td>
                    <td>
                        ${consulta.asunto}
                    </td>
                    <td>
                        ${consulta.mensaje}
                    </td>
                    <td>
                        ${consulta.respuesta ?? '-'}
                    </td>
                    <td>
                        <span
                            class="badge ${claseEstado}">
                            ${estadoTexto}
                        </span>
                    </td>
                </tr>
            `;
        }
    );
}
async function crearConsulta(event){
    event.preventDefault();
    const asunto =document.getElementById( "asunto").value;
    const mensaje =document.getElementById("mensaje").value;
    try {
        const token =
            localStorage.getItem("token");
        const response =
            await fetch(
                `${API_URL}/consultas`,
                {
                    method:"POST",
                    headers:{"Content-Type":"application/json",
                        Authorization:
                            `Bearer ${token}`
                    },
                    body:JSON.stringify({
                        asunto,mensaje
                    })
                }
            );
        if(!response.ok){
            throw new Error(
                "Error al crear consulta"
            );
        }
        document.getElementById("formConsulta").reset();
        bootstrap.Modal.getInstance(document.getElementById( "modalConsulta")).hide();
        await cargarConsultas();
        alert("Consulta enviada correctamente");
    } catch(error){
        console.error(error);
        alert( "No se pudo enviar la consulta");
    }
}