import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { productService } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import GradientView from '../components/GradientView';

const CATEGORIES = [
  'Electrónicos',
  'Librería',
  'Alimentos',
  'Ropa',
  'Hogar',
  'Deportes',
  'Juguetes',
  'Otros',
];

const CONDITIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'usado', label: 'Usado' },
  { value: 'reacondicionado', label: 'Reacondicionado' },
];

export default function EditProductScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'Electrónicos',
    condicion: 'nuevo',
    imagen: '',
  });

  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    if (!user) {
      Alert.alert('Sesión requerida', 'Debes iniciar sesión', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return;
    }
    loadProduct();
  }, [productId, user]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      
      setFormData({
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        precio: data.precio?.toString() || '',
        stock: data.stock?.toString() || '',
        categoria: data.categoria || 'Electrónicos',
        condicion: data.condicion || 'nuevo',
        imagen: data.imagen || '',
      });
      
      if (data.imagen) {
        setImageUri(data.imagen);
      }
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar el producto', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const compressImage = async (uri: string): Promise<string> => {
    try {
      const manipulatedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Error al convertir imagen'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
      throw error;
    }
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        setSaving(true);
        const base64 = await compressImage(result.assets[0].uri);
        setImageUri(result.assets[0].uri);
        setFormData((prev) => ({ ...prev, imagen: base64 }));
        setImageChanged(true);
        setError('');
      } catch (err) {
        Alert.alert('Error', 'No se pudo procesar la imagen');
      } finally {
        setSaving(false);
      }
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        setSaving(true);
        const base64 = await compressImage(result.assets[0].uri);
        setImageUri(result.assets[0].uri);
        setFormData((prev) => ({ ...prev, imagen: base64 }));
        setImageChanged(true);
        setError('');
      } catch (err) {
        Alert.alert('Error', 'No se pudo procesar la imagen');
      } finally {
        setSaving(false);
      }
    }
  };

  const selectImageSource = () => {
    Alert.alert(
      'Cambiar imagen',
      'Elige de dónde quieres obtener la imagen',
      [
        { text: 'Cámara', onPress: takePhoto },
        { text: 'Galería', onPress: pickImageFromGallery },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return false;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      return false;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('El stock no puede ser negativo');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      await productService.updateProduct(productId, {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
      });

      Alert.alert(
        '¡Actualizado! ✅',
        'Los cambios se guardaron correctamente',
        [
          {
            text: 'Volver a mis productos',
            onPress: () => navigation.navigate('MySales'),
          },
        ]
      );
    } catch (err: any) {
      console.error('Error al actualizar producto:', err);
      setError(err.message || 'No se pudo actualizar el producto');
      Alert.alert('Error', err.message || 'No se pudo actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar cambios',
      '¿Estás seguro? Los cambios no guardados se perderán',
      [
        { text: 'Continuar editando', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a855f7" />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header con gradiente */}
        <GradientView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Ionicons name="create-outline" size={32} color="#fff" />
            <Text style={styles.headerTitle}>Editar Producto</Text>
            <Text style={styles.headerSubtitle}>
              Actualiza la información de tu producto
            </Text>
          </View>
        </GradientView>

        <View style={styles.formContainer}>
          {/* Mensaje de error */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Selector de imagen */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Ionicons name="image" size={16} /> Imagen del Producto
            </Text>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={selectImageSource}
              disabled={saving && !loading}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Ionicons name="camera" size={48} color="#a855f7" />
                  <Text style={styles.imagePickerText}>Toca para cambiar imagen</Text>
                </View>
              )}
            </TouchableOpacity>
            {imageUri && (
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={selectImageSource}
              >
                <Ionicons name="camera" size={16} color="#a855f7" />
                <Text style={styles.changeImageText}>Cambiar imagen</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Título */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Ionicons name="cube" size={16} /> Título del producto *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Laptop Dell XPS 15"
              value={formData.titulo}
              onChangeText={(text) => setFormData({ ...formData, titulo: text })}
              maxLength={200}
              editable={!saving}
            />
          </View>

          {/* Descripción */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Ionicons name="document-text" size={16} /> Descripción
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe tu producto en detalle..."
              value={formData.descripcion}
              onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!saving}
            />
          </View>

          {/* Precio y Stock */}
          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>
                <Ionicons name="cash" size={16} /> Precio (CLP) *
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.precio}
                onChangeText={(text) => setFormData({ ...formData, precio: text })}
                keyboardType="decimal-pad"
                editable={!saving}
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>
                <Ionicons name="layers" size={16} /> Stock *
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                keyboardType="number-pad"
                editable={!saving}
              />
            </View>
          </View>

          {/* Categoría */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Ionicons name="pricetag" size={16} /> Categoría *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    formData.categoria === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, categoria: cat })}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.categoria === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Condición */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Ionicons name="star" size={16} /> Condición *
            </Text>
            <View style={styles.conditionContainer}>
              {CONDITIONS.map((cond) => (
                <TouchableOpacity
                  key={cond.value}
                  style={[
                    styles.conditionButton,
                    formData.condicion === cond.value && styles.conditionButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, condicion: cond.value })}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.conditionText,
                      formData.condicion === cond.value && styles.conditionTextActive,
                    ]}
                  >
                    {cond.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, saving && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Guardar Cambios</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#ef4444',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagePicker: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
  },
  imagePickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePickerText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
    gap: 6,
  },
  changeImageText: {
    color: '#a855f7',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryScroll: {
    marginTop: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButtonActive: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  conditionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  conditionButtonActive: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  conditionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  conditionTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
