const token = localStorage.getItem("token");
let paqueteEditando = null;
document.getElementById("btnGuardarPaquete").innerText = "Guardar Paquete";
if (!token) {
    window.location.href = "login.html";
}

cargarPaquetes();
cargarClientes();
cargarSucursales();

async function cargarPaquetes() {
    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/paquetes",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const paquetes = await response.json();

        const tabla = document.getElementById("tablaPaquetes");

        tabla.innerHTML = "";

        paquetes.forEach(paquete => {

            tabla.innerHTML += `
                <tr>
                    <td>
                        <span class="badge bg-primary">
                            ${paquete.codigo_seguimiento}
                        </span>
                    </td>

                    <td>
                        <strong>
                            ${paquete.titulo}
                        </strong>
                        <br>
                        <small class="text-muted">
                            ${paquete.descripcion}
                        </small>
                    </td>

                    <td>
                        ${paquete.usuario?.nombre ?? "-"}
                    </td>

                    <td>
                        ${paquete.sucursal_origen?.nombre ?? "-"}
                    </td>

                    <td>
                        ${paquete.sucursal_destino?.nombre ?? "-"}
                    </td>

                    <td>
                        ${formatearFecha(paquete.fecha_salida)}
                    </td>

                    <td>
                        ${formatearFecha(paquete.fecha_entrega)}
                    </td>
                    <td>

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="editarPaquete(${paquete.id})">

                            <i class="bi bi-pencil"></i>

                        </button>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="eliminarPaquete(${paquete.id})">

                            <i class="bi bi-trash"></i>

                        </button>

                    </td>
                </tr>
            `;
        });

    } catch (error) {

        console.error(error);

        alert("Error al cargar paquetes");
    }
}

async function cargarClientes() {
    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/usuarios",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const clientes = await response.json();

        const selectorCliente =
            document.getElementById("user_id");

        selectorCliente.innerHTML = "";

        clientes.forEach(cliente => {

            selectorCliente.innerHTML += `
                <option value="${cliente.id}">
                    ${cliente.nombre}
                </option>
            `;
        });

    } catch (error) {

        console.error(error);

        alert("Error al cargar clientes");
    }
}

async function cargarSucursales() {
    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/sucursales",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const sucursales = await response.json();

        const selectorOrigen =
            document.getElementById("sucursal_origen_id");

        const selectorDestino =
            document.getElementById("sucursal_destino_id");

        selectorOrigen.innerHTML = "";
        selectorDestino.innerHTML = "";

        sucursales.forEach(sucursal => {

            selectorOrigen.innerHTML += `
                <option value="${sucursal.id}">
                    ${sucursal.nombre}
                </option>
            `;

            selectorDestino.innerHTML += `
                <option value="${sucursal.id}">
                    ${sucursal.nombre}
                </option>
            `;
        });

    } catch (error) {

        console.error(error);

        alert("Error al cargar sucursales");
    }
}

async function guardarPaquete() {
    try {

        const datosPaquete = {
            titulo: document.getElementById("titulo").value,
            descripcion: document.getElementById("descripcion").value,
            fecha_salida: document.getElementById("fecha_salida").value,
            fecha_entrega: document.getElementById("fecha_entrega").value || null,
            user_id: parseInt(document.getElementById("user_id").value),
            sucursal_origen_id: parseInt(document.getElementById("sucursal_origen_id").value),
            sucursal_destino_id: parseInt(document.getElementById("sucursal_destino_id").value)
        };

        const url = paqueteEditando ? `http://127.0.0.1:8000/api/paquetes/${paqueteEditando}` : "http://127.0.0.1:8000/api/paquetes";
            const metodo = paqueteEditando ? "PUT" : "POST";
            const response = await fetch(url,
            {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(datosPaquete)
            }
        );
        if (!response.ok) {
            const error = await response.json();
            console.error(error);
            alert("No se pudo registrar el paquete");
            return;
        }
        alert("Paquete registrado correctamente");
        document.getElementById("formPaquete").reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalPaquete"));
        if (modal) {
            modal.hide();
        }
        cargarPaquetes();
    } catch (error) {
        console.error(error);
        alert("Error al guardar paquete");
    }
}

function formatearFecha(fecha) {
    if (!fecha) {
        return "-";
    }
    return new Date(fecha).toLocaleDateString(
        "es-BO",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}
async function editarPaquete(id) {

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/paquetes/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const paquete = await response.json();
        paqueteEditando = id;
        document.getElementById("titulo").value =paquete.titulo;
        document.getElementById("descripcion").value = paquete.descripcion;
        document.getElementById("fecha_salida").value = paquete.fecha_salida;
        document.getElementById("fecha_entrega").value = paquete.fecha_entrega ?? "";
        document.getElementById("user_id").value = paquete.user_id;
        document.getElementById("sucursal_origen_id").value =paquete.sucursal_origen_id;
        document.getElementById("sucursal_destino_id").value = paquete.sucursal_destino_id;
        document.getElementById( "btnGuardarPaquete").innerText = "Actualizar";
        const modal = new bootstrap.Modal(document.getElementById("modalPaquete"));
        modal.show();
    }
    catch(error) {
        console.error(error);
        alert( "Error al cargar paquete");
    }
}
async function eliminarPaquete(id) {
    const confirmar = confirm( "¿Desea eliminar este paquete?");
    if (!confirmar) {
        return;
    }
    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/paquetes/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (!response.ok) {
            throw new Error();
        }
        alert( "Paquete eliminado correctamente");
        cargarPaquetes();
    }
    catch(error) {
        console.error(error);

        alert("Error al eliminar paquete" );
    }
}