import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/config';

const AboutScreen = ({ navigation }: any) => {
  const features = [
    {
      icon: 'shield-checkmark',
      title: 'Compra Segura',
      description: 'Todas las transacciones son seguras y verificadas dentro de la comunidad universitaria.',
    },
    {
      icon: 'people',
      title: 'Comunidad Estudiantil',
      description: 'Conecta con estudiantes de tu universidad. Compra y vende productos entre compañeros.',
    },
    {
      icon: 'trending-up',
      title: 'Productos Variados',
      description: 'Desde tecnología hasta libros, snacks y más. Todo lo que necesitas en un solo lugar.',
    },
    {
      icon: 'star',
      title: 'Calificaciones',
      description: 'Sistema de ratings para garantizar la confianza entre vendedores y compradores.',
    },
  ];

  const stats = [
    { label: 'Productos', value: '1,000+', icon: 'cube' },
    { label: 'Usuarios', value: '500+', icon: 'people' },
    { label: 'Categorías', value: '50+', icon: 'grid' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre Nosotros</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroIcon}>🏪</Text>
        <Text style={styles.heroTitle}>StudiMarket</Text>
        <Text style={styles.heroSubtitle}>
          Tu Marketplace Universitario de Confianza
        </Text>
        <Text style={styles.heroDescription}>
          StudiMarket es el marketplace oficial para estudiantes universitarios. 
          Compra, vende e intercambia productos con tus compañeros de forma segura y confiable.
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={32} color={COLORS.primary} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nuestra Misión</Text>
        <Text style={styles.sectionText}>
          Facilitar el comercio entre estudiantes universitarios, creando una 
          comunidad donde puedan comprar y vender productos de manera segura, 
          económica y conveniente. Promovemos la economía circular y la 
          sostenibilidad dentro del campus.
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Por qué StudiMarket?</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name={feature.icon as any} size={28} color={COLORS.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* How it Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Cómo Funciona?</Text>
        
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Regístrate</Text>
            <Text style={styles.stepDescription}>
              Crea tu cuenta con tu correo universitario
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Explora</Text>
            <Text style={styles.stepDescription}>
              Busca productos o publica los tuyos
            </Text>
          </View>
        </View>

        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Conecta</Text>
            <Text style={styles.stepDescription}>
              Contacta con vendedores y completa tu compra
            </Text>
          </View>
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Linking.openURL('mailto:soporte@studimarket.com')}
        >
          <Ionicons name="mail" size={20} color={COLORS.white} />
          <Text style={styles.contactButtonText}>soporte@studimarket.com</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 StudiMarket</Text>
        <Text style={styles.footerSubtext}>
          Hecho con ❤️ para estudiantes universitarios
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.surface,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 500,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 32,
    backgroundColor: COLORS.background,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    padding: 32,
    backgroundColor: COLORS.surface,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  sectionText: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 24,
  },
  featureCard: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: '#94a3b8',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.background,
  },
  footerText: {
    fontSize: 15,
    color: '#94a3b8',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default AboutScreen;
