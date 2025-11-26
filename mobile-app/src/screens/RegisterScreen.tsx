import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/config';

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.nombre || !formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Cuenta creada exitosamente');
        await login(data.user, data.access_token);
      } else {
        Alert.alert('Error', data.detail || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={formData.nombre}
          onChangeText={(text) => setFormData({ ...formData, nombre: text })}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Teléfono (opcional)"
          value={formData.telefono}
          onChangeText={(text) => setFormData({ ...formData, telefono: text })}
          keyboardType="phone-pad"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    minHeight: 600,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
