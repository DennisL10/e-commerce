document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productTable = document.getElementById('product-table').getElementsByTagName('tbody')[0];
    const deleteAllButton = document.getElementById('delete-all');

    const loadProducts = () => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productTable.innerHTML = '';
        products.forEach((product, index) => {
            const row = productTable.insertRow();
            row.insertCell().textContent = product.name;
            row.insertCell().innerHTML = `<img src="${product.image}" alt="${product.name}" width="100">`;
            row.insertCell().textContent = product.category;
            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button class="edit-button" data-index="${index}">Editar</button>
                <button class="delete-button" data-index="${index}">Eliminar</button>
            `;
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const product = products[index];
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-image').value = product.image;
                document.getElementById('product-category').value = product.category;
                productForm.onsubmit = (e) => {
                    e.preventDefault();
                    product.name = document.getElementById('product-name').value;
                    product.image = document.getElementById('product-image').value;
                    product.category = document.getElementById('product-category').value;
                    products[index] = product;
                    localStorage.setItem('products', JSON.stringify(products));
                    loadProducts();
                    productForm.reset();
                    productForm.onsubmit = handleFormSubmit;
                };
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.dataset.index;
                let products = JSON.parse(localStorage.getItem('products')) || [];
                products.splice(index, 1);
                localStorage.setItem('products', JSON.stringify(products));
                loadProducts();
            });
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const image = document.getElementById('product-image').value;
        const category = document.getElementById('product-category').value;
        
        const product = { name, image, category };
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        productForm.reset();
    };

    productForm.onsubmit = handleFormSubmit;

    deleteAllButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar todos los productos?')) {
            localStorage.removeItem('products');
            loadProducts();
        }
    });

    loadProducts();
});
