import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/config';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 40,
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 0) return '?';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const shouldShowImage = source && !imageError;

  return (
    <View 
      style={[
        styles.avatar, 
        { width: size, height: size, borderRadius: size / 2 },
        style
      ]}
    >
      {shouldShowImage ? (
        <Image
          source={source}
          style={styles.image}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}30`,
  },
  initials: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
