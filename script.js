// Productos de la tienda con categorías
const productos = [
    { id: 1, nombre: "Labial Mate", precio: 12.99, categoria: "labios", imagen: "https://images.pexels.com/photos/13214684/pexels-photo-13214684.jpeg" },
    { id: 2, nombre: "Base de Maquillaje", precio: 24.50, categoria: "rostro", imagen: "https://images.pexels.com/photos/27676711/pexels-photo-27676711/free-photo-of-moda-maquillaje-belleza-botella.jpeg" },
    { id: 3, nombre: "Paleta de Sombras", precio: 35.00, categoria: "ojos", imagen: "https://images.pexels.com/photos/6954164/pexels-photo-6954164.jpeg" },
    { id: 4, nombre: "Delineador Líquido", precio: 9.99, categoria: "ojos", imagen: "https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg" },
    { id: 5, nombre: "Rubor Compacto", precio: 14.75, categoria: "rostro", imagen: "https://images.pexels.com/photos/5403547/pexels-photo-5403547.jpeg" },
    { id: 6, nombre: "Máscara de Pestañas", precio: 18.99, categoria: "ojos", imagen: "https://www.maybelline.co/-/media/project/loreal/brand-sites/mny/americas/latam/products/eye-makeup/mascara/maybelline-lash-sensational-sky-high-wtp-802-very-black-o.jpg" },
    { id: 7, nombre: "Esponja de Maquillaje", precio: 7.50, categoria: "rostro", imagen: "https://images.pexels.com/photos/31252216/pexels-photo-31252216/free-photo-of-marca-zola.jpeg" },
    { id: 8, nombre: "Iluminador en Polvo", precio: 22.99, categoria: "rostro", imagen: "https://beautyface.com.co/wp-content/uploads/2023/03/s2629483-main-zoom.webp" }
];

const carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Recuperar carrito del localStorage
const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");

// Mostrar productos
function mostrarProductos() {
    contenedorProductos.innerHTML = ''; // Limpiar el contenedor
    productos.forEach(prod => {
        const div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>Precio: $${prod.precio.toFixed(2)}</p>
            <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(div);
    });
}

// Agregar al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar el carrito en localStorage
    actualizarCarrito();
}

// Actualizar el carrito
function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;
    carrito.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
        listaCarrito.appendChild(li);
        total += item.precio;
    });
    totalCarrito.textContent = total.toFixed(2);
    // Si hay productos en el carrito, mostrar el botón de pagar
    document.getElementById("pagar").style.display = carrito.length > 0 ? "inline-block" : "none";
}

// Vaciar el carrito
function vaciarCarrito() {
    carrito.length = 0;
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Limpiar el carrito en localStorage
    actualizarCarrito();
}

// Filtrar por categoría
function filtrarPorCategoria() {
    const categoria = document.getElementById("categoria").value;
    if (categoria === 'all') {
        mostrarProductos();
    } else {
        const productosFiltrados = productos.filter(p => p.categoria === categoria);
        contenedorProductos.innerHTML = '';
        productosFiltrados.forEach(prod => {
            const div = document.createElement("div");
            div.className = "producto";
            div.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>Precio: $${prod.precio.toFixed(2)}</p>
                <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
            `;
            contenedorProductos.appendChild(div);
        });
    }
}

// Función para iniciar el pago con PayPal
function iniciarPago() {
    const total = parseFloat(totalCarrito.textContent);
    if (total > 0) {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert("Pago realizado con éxito!");
                    vaciarCarrito(); // Vaciar el carrito después del pago
                });
            }
        }).render("#paypal-button-container");
    }
}

// Inicializar la tienda
mostrarProductos();
