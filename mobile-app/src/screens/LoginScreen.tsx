import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/config';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudiMarket</Text>
      <Text style={styles.subtitle}>Marketplace Estudiantil</Text>
      <TextInput style={styles.input} placeholder='Email' placeholderTextColor={COLORS.textSecondary} value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none' />
      <TextInput style={styles.input} placeholder='Contraseña' placeholderTextColor={COLORS.textSecondary} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: COLORS.surface, color: COLORS.text, padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  registerLink: { marginTop: 20, alignItems: 'center' },
  registerText: { color: COLORS.primary, fontSize: 14 }
});
