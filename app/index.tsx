import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  Image as RNImage,
} from 'react-native';

// Constants for easy tuning
const GRID_SIZE = 3;
const TILE_SIZE = 100;
const ZOOM_STEP = 1.2;
const MAX_ZOOM = 2;

interface TileProps {
  primaryUrl: string;
  secondaryUrl: string;
}

// Individual tile component with its own state & animations
const ImageTile: React.FC<TileProps> = ({ primaryUrl, secondaryUrl }) => {
  const [showSecondary, setShowSecondary] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentUrl = showSecondary ? secondaryUrl : primaryUrl;

  const handlePress = () => {
    // Determine next zoom
    const nextZoom = Math.min(zoomLevel * ZOOM_STEP, MAX_ZOOM);
    if (zoomLevel >= MAX_ZOOM) {
      // reset
      setZoomLevel(1);
      setShowSecondary(false);
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    } else {
      // toggle image and zoom
      setShowSecondary(prev => !prev);
      setZoomLevel(nextZoom);
      setIsLoading(true);
      Animated.spring(scaleAnim, { toValue: nextZoom, useNativeDriver: true }).start();
    }
  };

  const onLoad = () => setIsLoading(false);
  const onError = () => {
    setLoadError(true);
    setIsLoading(false);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.tileContainer}>
      <Animated.View style={[styles.tile, { transform: [{ scale: scaleAnim }] }]}>        
        {isLoading && (
          <View style={styles.overlay}>
            <Text>Loading...</Text>
          </View>
        )}
        {loadError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️</Text>
          </View>
        ) : Platform.OS === 'web' ? (
          <img
            src={currentUrl}
            style={styles.webImage}
            onLoad={onLoad}
            onError={onError}
            alt="tile"
          />
        ) : (
          <RNImage
            source={{ uri: currentUrl }}
            style={[styles.image, isLoading && { opacity: 0 }]}
            onLoad={onLoad}
            onError={onError}
          />
        )}
        {zoomLevel > 1 && (
          <View style={styles.zoomBadge}>
            <Text style={styles.badgeText}>{zoomLevel.toFixed(1)}×</Text>
          </View>
        )}
        {showSecondary && (
          <View style={styles.altBadge}>
            <Text style={styles.altText}>ALT</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Main grid component
export default function RefactoredGrid() {
  // Define 9 unique tile URLs
  const tiles = [
    { primary: 'https://i.pinimg.com/736x/75/92/db/7592db5a2192b56c77f264b6dbc08adf.jpg', secondary: 'https://i.pinimg.com/736x/0e/f2/bc/0ef2bca247bb66f486b0989809d3cabc.jpg' },
    { primary: 'https://i.pinimg.com/736x/2b/a2/15/2ba21552ecf27b4cc8bad065f7966d7c.jpg', secondary: 'https://i.pinimg.com/736x/93/ed/c7/93edc709f49fe9492b30c236d755d2d0.jpg' },
    { primary: 'https://i.pinimg.com/736x/00/85/d4/0085d41dc397a01100ba57ff343fcaf4.jpg', secondary: 'https://i.pinimg.com/736x/9c/37/77/9c377772ff3772252d204dec58954e5f.jpg' },
    { primary: 'https://i.pinimg.com/736x/fb/e5/24/fbe524e8c4ff4db3a2b43d34f4d72beb.jpg', secondary: 'https://i.pinimg.com/736x/0c/e5/97/0ce5977b1decf5a9355e6198edb8135a.jpg' },
    { primary: 'https://i.pinimg.com/736x/bd/43/9b/bd439b9c262f26862db5f38013fd5247.jpg', secondary: 'https://i.pinimg.com/736x/00/9d/f9/009df9a07a54f00afc6cc6406476974a.jpg' },
    { primary: 'https://i.pinimg.com/736x/31/40/da/3140da0b7432043a241c9cea23c2185b.jpg', secondary: 'https://i.pinimg.com/736x/6b/ae/6e/6bae6e627c649815c67b35a524638b77.jpg' },
    { primary: 'https://i.pinimg.com/736x/a2/e9/68/a2e968998a3036344752dda71777cefb.jpg', secondary: 'https://i.pinimg.com/736x/5c/21/bd/5c21bdb6c78c578ca40995ec4995b09a.jpg' },
    { primary: 'https://i.pinimg.com/736x/4f/b8/0b/4fb80bacc421a8989205f2b1716be080.jpg', secondary: 'https://i.pinimg.com/736x/95/f6/3e/95f63e785f4bc9202ae94661f7e2bba3.jpg' },
    { primary: 'https://i.pinimg.com/736x/24/17/3e/24173e5c27cd4d0bcacbefb110ae4b6b.jpg', secondary: 'https://i.pinimg.com/736x/bb/a3/43/bba3435144a1b85de0b7e778df5722fd.jpg' },
  ];

  return (
    <View style={styles.gridContainer}>
      {tiles.map((tile, idx) => (
        <ImageTile
          key={idx}
          primaryUrl={tile.primary}
          secondaryUrl={tile.secondary}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: TILE_SIZE * GRID_SIZE + 10 * (GRID_SIZE - 1),
    alignSelf: 'center',
    marginTop: 20,
  },
  tileContainer: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 5,
  },
  tile: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  webImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { fontSize: 20, color: '#b00' },
  zoomBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  badgeText: { color: '#fff', fontSize: 10 },
  altBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(255,165,0,0.9)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  altText: { color: '#fff', fontSize: 10 },
});
