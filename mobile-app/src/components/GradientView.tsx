import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientViewProps {
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children: React.ReactNode;
}

export default function GradientView({ 
  colors = ['#a855f7', '#7c3aed'], 
  start, 
  end, 
  style, 
  children 
}: GradientViewProps) {
  // En web, usar el primer color como fondo sólido
  if (Platform.OS === 'web') {
    return (
      <View style={[{ backgroundColor: colors[0] }, style]}>
        {children}
      </View>
    );
  }

  // En móvil, usar LinearGradient normal
  return (
    <LinearGradient colors={colors} start={start} end={end} style={style}>
      {children}
    </LinearGradient>
  );
}
