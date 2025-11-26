import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../contexts/ProductsContext';
import { COLORS } from '../constants/config';
import { useWindowDimensions } from 'react-native';

const CATEGORIES = [
  'Todos',
  'Electrónicos',
  'Ropa',
  'Hogar',
  'Deportes',
  'Libros',
  'Juguetes',
  'Otros',
];

export default function SearchScreen({ navigation }: any) {
  const { products, loading } = useProducts();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Calculate responsive grid columns
  const numColumns = width >= 1200 ? 4 : width >= 900 ? 3 : width >= 600 ? 2 : 1;

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, priceRange, products]);

  const applyFilters = () => {
    if (!products) return;

    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.nombre.toLowerCase().includes(query) ||
          product.descripcion?.toLowerCase().includes(query) ||
          product.categoria?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(
        (product) =>
          product.categoria?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.precio >= priceRange[0] && product.precio <= priceRange[1]
    );

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setPriceRange([0, 1000000]);
  };

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.productCard, { width: `${100 / numColumns}%` }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: item.imagen || 'https://via.placeholder.com/200',
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.productCategory}>{item.categoria || 'Sin categoría'}</Text>
        <Text style={styles.productPrice}>${item.precio?.toLocaleString('es-CL')}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = (category: string) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
        onPress={() => setSelectedCategory(category)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={80} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No se encontraron productos</Text>
      <Text style={styles.emptyText}>
        Intenta ajustar los filtros o realiza una búsqueda diferente
      </Text>
      <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
        <Text style={styles.resetButtonText}>Limpiar filtros</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Productos</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name={showFilters ? 'close' : 'options-outline'}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#9ca3af"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Categories */}
          <Text style={styles.filterTitle}>Categorías</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map(renderCategory)}
          </ScrollView>

          {/* Price Range */}
          <View style={styles.priceRangeContainer}>
            <Text style={styles.filterTitle}>Rango de Precio</Text>
            <View style={styles.priceInputsRow}>
              <View style={styles.priceInputContainer}>
                <Text style={styles.priceLabel}>Mínimo</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={priceRange[0].toString()}
                  onChangeText={(text) => {
                    const min = parseInt(text) || 0;
                    setPriceRange([min, priceRange[1]]);
                  }}
                />
              </View>
              <Text style={styles.priceSeparator}>-</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.priceLabel}>Máximo</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="1000000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={priceRange[1].toString()}
                  onChangeText={(text) => {
                    const max = parseInt(text) || 1000000;
                    setPriceRange([priceRange[0], max]);
                  }}
                />
              </View>
            </View>
          </View>

          {/* Reset Filters */}
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={resetFilters}
          >
            <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}{' '}
          encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={
          filteredProducts.length === 0
            ? styles.emptyListContainer
            : styles.listContainer
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginLeft: 16,
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  priceRangeContainer: {
    marginTop: 8,
  },
  priceInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  priceSeparator: {
    fontSize: 18,
    color: '#6b7280',
    marginHorizontal: 12,
    marginTop: 20,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  clearFiltersText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  productCard: {
    padding: 8,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
