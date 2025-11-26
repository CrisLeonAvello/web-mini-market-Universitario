import { Dimensions, Platform } from 'react-native';

export const useResponsive = () => {
  const { width, height } = Dimensions.get('window');
  
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  // Número de columnas según el ancho
  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMobile ? 2 : 1;
  
  // Padding responsivo
  const containerPadding = isDesktop ? 40 : isTablet ? 24 : 16;
  
  // Font sizes responsivos
  const fontSize = {
    small: isDesktop ? 14 : 12,
    normal: isDesktop ? 16 : 14,
    large: isDesktop ? 20 : 18,
    xlarge: isDesktop ? 28 : 24,
  };
  
  return {
    width,
    height,
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    numColumns,
    containerPadding,
    fontSize,
  };
};

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};
