const token = localStorage.getItem("token");
let sucursalEditando = null;
if (!token) { 
    window.location.href ="login.html";
}
cargarSucursales();
cargarCiudades();
async function cargarSucursales() {
    try {
        const response =
            await fetch(
                "http://127.0.0.1:8000/api/sucursales",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        const sucursales =await response.json();
        const tabla = document.getElementById("tablaSucursales");
        tabla.innerHTML = "";
        sucursales.forEach(
            sucursal => {
            tabla.innerHTML += `
            <tr>
                <td>
                    <span class="badge bg-secondary">
                        #${sucursal.id}
                    </span>
                </td>
                <td>
                    <strong>
                        ${sucursal.nombre}
                    </strong>
                </td>
                <td>
                    ${sucursal.direccion}
                </td>
                <td>
                    <i class="bi bi-telephone-fill"></i>
                    ${sucursal.telefono}
                </td>
                <td>
                    <span class="badge bg-primary">
                        ${sucursal.ciudad?.nombre ?? "-"}
                    </span>
                </td>
                <td>
                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editarSucursal(${sucursal.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button
                        class="btn btn-danger btn-sm"
                        onclick="eliminarSucursal(${sucursal.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        });
    }
    catch(error){
        console.error(error);
        alert("Error al cargar sucursales");
    }

}
async function cargarCiudades() {
    try {
        const response =
            await fetch(
                "http://127.0.0.1:8000/api/ciudades",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        const ciudades = await response.json();
        const select = document.getElementById("ciudad_id");
        select.innerHTML =
            `<option value="">
                Seleccione una ciudad
            </option>`;
        ciudades.forEach(ciudad => {
            select.innerHTML += `
                <option value="${ciudad.id}">
                    ${ciudad.nombre}
                </option>
            `;
        });

    }
    catch(error) {
        console.error(error);
    }
}
async function guardarSucursal() {
    const datosSucursal = {
        nombre: document.getElementById("nombre").value,
        direccion: document.getElementById("direccion").value,
        telefono: document.getElementById("telefono").value,
        ciudad_id: parseInt(document.getElementById("ciudad_id").value)
    };
    const url = sucursalEditando ? `http://127.0.0.1:8000/api/sucursales/${sucursalEditando}` : "http://127.0.0.1:8000/api/sucursales";
    const metodo = sucursalEditando ? "PUT" : "POST";
    try {
        const response =
            await fetch(
                url,
                {
                    method: metodo,
                    headers: {
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(datosSucursal)
                }
            );

        if(!response.ok){
            throw new Error();
        }

        document.getElementById("formSucursal").reset();
        sucursalEditando = null;
        document.getElementById("btnGuardarSucursal").innerText = "Guardar";
        const modal =bootstrap.Modal.getInstance(document.getElementById("modalSucursal"));
        if(modal){
            modal.hide();
        }
        cargarSucursales();
    }
    catch(error){
        console.error(error);
        alert("Error al guardar sucursal");
    }
}
async function editarSucursal(id) {
    try {
        const response =
            await fetch(
                `http://127.0.0.1:8000/api/sucursales/${id}`,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        const sucursal = await response.json();
        sucursalEditando = id;
        document.getElementById("nombre").value = sucursal.nombre;
        document.getElementById("direccion").value = sucursal.direccion;
        document.getElementById("telefono").value =sucursal.telefono;
        document.getElementById("ciudad_id").value = sucursal.ciudad_id;
        document.getElementById("btnGuardarSucursal").innerText = "Actualizar";
        const modal = new bootstrap.Modal(document.getElementById("modalSucursal"));
        modal.show();
    }
    catch(error){
        console.error(error);
        alert("Error al cargar sucursal");
    }
}
async function eliminarSucursal(id) {
    const confirmar = confirm("¿Desea eliminar esta sucursal?");
    if(!confirmar){
        return;
    }
    try {
        const response =
            await fetch(
                `http://127.0.0.1:8000/api/sucursales/${id}`,
                {
                    method:"DELETE",
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        if(!response.ok){
            throw new Error();
        }
        cargarSucursales();
    }
    catch(error){
        console.error(error);

        alert("Error al eliminar sucursal");
    }
}