import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../constants/config';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  style,
  textStyle,
}) => {
  const variantStyles = {
    default: {
      backgroundColor: `${COLORS.primary}20`,
      color: COLORS.primary,
    },
    success: {
      backgroundColor: '#10b98120',
      color: '#10b981',
    },
    warning: {
      backgroundColor: '#f59e0b20',
      color: '#f59e0b',
    },
    error: {
      backgroundColor: '#ef444420',
      color: '#ef4444',
    },
    info: {
      backgroundColor: '#3b82f620',
      color: '#3b82f6',
    },
  };

  return (
    <View 
      style={[
        styles.badge, 
        { backgroundColor: variantStyles[variant].backgroundColor },
        style
      ]}
    >
      <Text 
        style={[
          styles.text, 
          { color: variantStyles[variant].color },
          textStyle
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
