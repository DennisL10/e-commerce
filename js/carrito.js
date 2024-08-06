let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Cargar productos en el carrito
function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    const perfil = JSON.parse(localStorage.getItem("perfil")) || {};
    const metodoPago = perfil.metodoPago || ""; // Recupera el método de pago desde el perfil

    console.log("Método de pago al comprar:", metodoPago); // Verifica el valor recuperado

    if (Object.keys(perfil).length === 0) {
        Toastify({
            text: "Debes completar tu perfil antes de comprar.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #e85d5d, #ff6b6b)",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            }
        }).showToast();
    } else {
        let metodoPagoHTML = "";
        if (metodoPago === "tarjeta") {
            const tarjeta = JSON.parse(localStorage.getItem("tarjeta")) || {};
            metodoPagoHTML = `
                <p><strong>Numero de Tarjeta:</strong> ${tarjeta.numero ? tarjeta.numero.replace(/\d{12}(\d{4})/, '************$1') : 'No disponible'}</p>
                <p><strong>Fecha de Expiración:</strong> ${tarjeta.expiracion || 'No disponible'}</p>
                <p><strong>CVV:</strong> ${tarjeta.cvv ? '***' : 'No disponible'}</p>
            `;
        } else if (metodoPago === "efectivo") {
            metodoPagoHTML = "<p>Pago mediante efectivo.</p>";
        } else {
            metodoPagoHTML = "<p>No se ha seleccionado un método de pago válido.</p>";
        }

        Swal.fire({
            title: 'Información del Perfil y Método de Pago',
            html: `
                <p><strong>Nombre:</strong> ${perfil.nombre || 'No disponible'}</p>
                <p><strong>Dirección:</strong> ${perfil.direccion || 'No disponible'}</p>
                <p><strong>Teléfono:</strong> ${perfil.telefono || 'No disponible'}</p>
                <h3>Método de Pago</h3>
                ${metodoPagoHTML}
            `,
            confirmButtonText: 'Confirmar Compra'
        }).then((result) => {
            if (result.isConfirmed) {
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                contenedorCarritoVacio.classList.add("disabled");
                contenedorCarritoProductos.classList.add("disabled");
                contenedorCarritoAcciones.classList.add("disabled");
                contenedorCarritoComprado.classList.remove("disabled");

              
            }
        });
    }
}
``
