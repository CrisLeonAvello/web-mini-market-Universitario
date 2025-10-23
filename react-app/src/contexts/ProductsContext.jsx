import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTransformedProducts, getTransformedCategories } from '../services/fakeStoreApi';

const ProductsContext = createContext();

export function useProducts() { 
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductsProvider');
  }
  return context;
}

// Estado inicial de filtros
const initialFilters = {
  category: '',
  search: '',
  minPrice: 0,
  maxPrice: 200000,
  minRating: 0
};

export function ProductsProvider({ children }) {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos al inicializar
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Aplicar filtros cuando cambien los productos o filtros
  useEffect(() => {
    applyFilters();
  }, [allProducts, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular evento de carga para loading screen
      if (typeof CustomEvent !== 'undefined' && typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('resourceLoaded', {
          detail: 'Loading products from FakeStore API...'
        }));
      }
      
      console.log('🔄 Cargando productos desde FakeStore API...');
      console.log('📞 Llamando a getTransformedProducts()...');
      
      const products = await getTransformedProducts();
      
      console.log('📦 Productos recibidos de la API:', products);
      console.log('📊 Tipo de datos:', typeof products, Array.isArray(products));
      
      if (!Array.isArray(products)) {
        throw new Error('Los datos de productos no tienen el formato esperado');
      }
      
      console.log('✅ Productos cargados desde API:', products.length);
      console.log('📦 Primer producto:', products[0]);
      setAllProducts(products);
      
      // Actualizar filtro de precio máximo basado en productos
      if (products.length > 0) {
        const maxPrice = Math.max(...products.map(p => p.price || 0));
        const roundedMax = Math.ceil(maxPrice / 10) * 10;
        setFilters(prev => ({ ...prev, maxPrice: roundedMax }));
      }
      
      // Disparar evento de productos cargados
      if (typeof CustomEvent !== 'undefined' && typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('resourceLoaded', {
          detail: 'Products loaded successfully from API'
        }));
      }
      
    } catch (error) {
      console.error('❌ Error cargando productos desde API:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      console.log('🔄 Cargando categorías desde API...');
      const apiCategories = await getTransformedCategories();
      setCategories(apiCategories);
      console.log('✅ Categorías cargadas:', apiCategories.length);
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
    }
  };

  const applyFilters = () => {
    console.log('🔍 Aplicando filtros:', filters);
    console.log('📦 Total productos disponibles:', allProducts.length);
    
    let filtered = [...allProducts];
    
    // Filtro por categoría
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    // Filtro por búsqueda
    if (filters.search && filters.search !== '') {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        (product.title && product.title.toLowerCase().includes(searchTerm)) ||
        (product.name && product.name.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.category && product.category.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filtro por precio
    filtered = filtered.filter(product => 
      product.price >= filters.minPrice && 
      product.price <= filters.maxPrice
    );
    
    // Filtro por rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => 
        product.rating && product.rating.rate >= filters.minRating
      );
    }
    
    console.log(`📋 Productos filtrados: ${filtered.length} de ${allProducts.length}`);
    console.log('🔍 Filtros aplicados:', filters);
    if (filtered.length > 0) {
      console.log('📦 Primer producto filtrado:', filtered[0]);
    }
    setFilteredProducts(filtered);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    console.log('🔄 Reseteando filtros...');
    
    // Calcular precio máximo actual
    let maxPrice = 200000;
    if (allProducts.length > 0) {
      const prices = allProducts.map(p => p.precio);
      const maxProductPrice = Math.max(...prices);
      maxPrice = Math.ceil(maxProductPrice / 10000) * 10000;
    }
    
    setFilters({
      ...initialFilters,
      maxPrice
    });
  };

  const getProductById = (id) => {
    return allProducts.find(product => product.id === id);
  };

  const getCategories = () => {
    const categories = [...new Set(allProducts.map(p => p.categoria))];
    return categories.sort();
  };

  const getPriceRange = () => {
    if (allProducts.length === 0) return { min: 0, max: 200000 };
    
    const prices = allProducts.map(p => p.precio);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const getRatingRange = () => {
    if (allProducts.length === 0) return { min: 0, max: 5 };
    
    const ratings = allProducts.map(p => p.rating);
    return {
      min: Math.min(...ratings),
      max: Math.max(...ratings)
    };
  };

  // Funciones de utilidad
  const getDefaultImage = (categoria) => {
    const defaultImages = {
      'Tecnología': '/imagenes/default-tech.png',
      'Libros': '/imagenes/libroia.png',
      'Deportes': '/imagenes/pelotafutbol.png',
      'Ropa': '/imagenes/Polerasantaferia.png',
      'Hogar': '/imagenes/lampara.png',
      'Juguetes': '/imagenes/setjuguetesjpg.jpg'
    };
    return defaultImages[categoria] || '/imagenes/default.png';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    return stars;
  };

  // Debug functions
  const debugFilters = () => {
    console.log('=== DEBUG FILTROS ===');
    console.log('Filtros actuales:', filters);
    console.log('Total productos:', allProducts.length);
    console.log('Productos filtrados:', filteredProducts.length);
    
    if (allProducts.length > 0) {
      const priceRange = getPriceRange();
      const ratingRange = getRatingRange();
      
      console.log('Rango de precios:', priceRange);
      console.log('Rango de ratings:', ratingRange);
      console.log('Categorías disponibles:', getCategories());
    }
    
    return {
      filters,
      totalProducts: allProducts.length,
      filteredProducts: filteredProducts.length,
      categories: getCategories(),
      priceRange: getPriceRange(),
      ratingRange: getRatingRange()
    };
  };

  const value = {
    allProducts,
    filteredProducts,
    categories, // Categorías de la API
    filters,
    loading,
    error,
    loadProducts,
    loadCategories,
    updateFilters,
    resetFilters,
    getProductById,
    getCategories,
    getPriceRange,
    getRatingRange,
    getDefaultImage,
    renderStars,
    debugFilters
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}