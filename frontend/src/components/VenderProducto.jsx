import React, { useState } from 'react';
import { createProduct } from '../services/api';
import { FaBox, FaDollarSign, FaImage, FaTag, FaWarehouse } from 'react-icons/fa';

export default function VenderProducto({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'Electrónicos',
    imagen: '',
    condicion: 'nuevo'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categorias = [
    'Electrónicos',
    'Librería',
    'Alimentos',
    'Ropa',
    'Hogar',
    'Deportes',
    'Juguetes',
    'Otros'
  ];

  const condiciones = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'usado', label: 'Usado' },
    { value: 'reacondicionado', label: 'Reacondicionado' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!formData.precio || formData.precio <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (!formData.stock || formData.stock < 0) {
      setError('El stock no puede ser negativo');
      return;
    }

    try {
      setLoading(true);
      const response = await createProduct(formData);
      console.log('✅ Producto creado:', response);
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: 'Electrónicos',
        imagen: '',
        condicion: 'nuevo'
      });

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      console.error('❌ Error al crear producto:', err);
      setError(err.message || 'Error al publicar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vender-producto-container">
      <div className="vender-producto-header">
        <h2>📦 Publicar Nuevo Producto</h2>
        <p>Completa el formulario para publicar tu producto en el marketplace</p>
      </div>

      <form onSubmit={handleSubmit} className="vender-producto-form">
        {error && (
          <div className="form-error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Título */}
        <div className="form-group">
          <label htmlFor="titulo">
            <FaBox /> Título del producto *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej: Laptop Dell XPS 15"
            maxLength={200}
            required
          />
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">
            📝 Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe tu producto en detalle..."
            rows={4}
          />
        </div>

        {/* Precio y Stock */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="precio">
              <FaDollarSign /> Precio (CLP) *
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              placeholder="0"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">
              <FaWarehouse /> Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>

        {/* Categoría y Condición */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoria">
              <FaTag /> Categoría *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="condicion">
              ✨ Condición *
            </label>
            <select
              id="condicion"
              name="condicion"
              value={formData.condicion}
              onChange={handleChange}
              required
            >
              {condiciones.map(cond => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* URL de Imagen */}
        <div className="form-group">
          <label htmlFor="imagen">
            <FaImage /> URL de Imagen
          </label>
          <input
            type="url"
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {formData.imagen && (
            <div className="image-preview">
              <img src={formData.imagen} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Publicando...' : '🚀 Publicar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
