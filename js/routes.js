const express = require('express');
const Product = require('./productModel');

const router = express.Router();

// Obtener todos los productos
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

// Agregar un nuevo producto
router.post('/products', async (req, res) => {
    const { name, image, category, value, quantity } = req.body;
    try {
        const newProduct = new Product({ name, image, category, value, quantity });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto' });
    }
});

// Actualizar un producto
router.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image, category, value, quantity } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, image, category, value, quantity }, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
});

// Eliminar un producto
router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
});

// Eliminar todos los productos (opcional)
router.delete('/products', async (req, res) => {
    try {
        await Product.deleteMany();
        res.json({ message: 'Todos los productos eliminados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar todos los productos' });
    }
});

module.exports = router;
