document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productTable = document.getElementById('product-table').getElementsByTagName('tbody')[0];
    const deleteAllButton = document.getElementById('delete-all');

    const apiUrl = 'http://localhost:5000/productos'; // Cambia esta URL si es necesario

    // Función para cargar productos desde el servidor
    const loadProducts = async () => {
        try {
            const response = await fetch(apiUrl);
            const products = await response.json();
            productTable.innerHTML = '';
            products.forEach((product) => {
                const row = productTable.insertRow();
                row.insertCell().textContent = product.name;
                row.insertCell().innerHTML = `<img src="${product.image}" alt="${product.name}" width="100">`;
                row.insertCell().textContent = product.category;
                row.insertCell().textContent = product.value; // Mostrar el valor
                row.insertCell().textContent = product.quantity; // Mostrar la cantidad
                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `
                    <button class="edit-button" data-id="${product._id}">Editar</button>
                    <button class="delete-button" data-id="${product._id}">Eliminar</button>
                `;
            });

            // Manejo de botones de edición
            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const id = event.target.dataset.id;
                    console.log('ID del producto:', id); // Para verificar el ID
            
                    try {
                        const response = await fetch(`${apiUrl}/${id}`);
                        if (!response.ok) {
                            throw new Error('Error en la respuesta del servidor');
                        }
                        const product = await response.json();
                        
                        // Verifica que `product` tenga los datos correctos
                        console.log('Datos del producto:', product);
                        
                        // Asegúrate de que estos elementos existen en el HTML
                        document.getElementById('product-name').value = product.name || '';
                        document.getElementById('product-image').value = product.image || '';
                        document.getElementById('product-category').value = product.category || '';
                        document.getElementById('product-value').value = product.value || '';
                        document.getElementById('product-quantity').value = product.quantity || '';
            
                        // Actualizar el formulario para manejar la actualización del producto
                        productForm.onsubmit = async (e) => {
                            e.preventDefault();
                            const updatedProduct = {
                                name: document.getElementById('product-name').value,
                                image: document.getElementById('product-image').value,
                                category: document.getElementById('product-category').value,
                                value: document.getElementById('product-value').value,
                                quantity: document.getElementById('product-quantity').value
                            };
                            try {
                                await fetch(`${apiUrl}/${id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(updatedProduct)
                                });
                                loadProducts();
                                productForm.reset();
                                productForm.onsubmit = handleFormSubmit; // Restaurar el manejador de envío del formulario
                            } catch (error) {
                                console.error('Error al actualizar el producto', error);
                            }
                        };
                    } catch (error) {
                        console.error('Error al cargar el producto', error);
                    }
                });
            });
            

            // Manejo de botones de eliminación
            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const id = event.target.dataset.id;
                    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                        try {
                            await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
                            loadProducts();
                        } catch (error) {
                            console.error('Error al eliminar el producto', error);
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error al cargar productos', error);
        }
    };

    // Manejo del envío del formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newProduct = {
            name: document.getElementById('product-name').value,
            image: document.getElementById('product-image').value,
            category: document.getElementById('product-category').value,
            value: document.getElementById('product-value').value,
            quantity: document.getElementById('product-quantity').value
        };
        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            loadProducts();
            productForm.reset();
        } catch (error) {
            console.error('Error al agregar el producto', error);
        }
    };

    productForm.onsubmit = handleFormSubmit;

    // Manejo del botón "Eliminar Todos"
    deleteAllButton.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que quieres eliminar todos los productos?')) {
            try {
                await fetch(apiUrl, { method: 'DELETE' });
                loadProducts();
            } catch (error) {
                console.error('Error al eliminar todos los productos', error);
            }
        }
    });

    loadProducts();
});
