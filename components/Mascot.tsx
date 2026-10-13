import { Image, StyleSheet } from 'react-native';
import { MUGGO_3D, type MuggoPose } from '../assets/mascot3d';

// Muggo in 3D. The cream limbs are shaded, so it reads on light and dark without a backing panel.
type Props = {
  pose: MuggoPose;
  size?: number;
  label?: string;
};

export function Mascot({ pose, size = 140, label }: Props) {
  return (
    <Image
      source={MUGGO_3D[pose]}
      resizeMode="contain"
      accessible
      accessibilityRole="image"
      accessibilityLabel={label ?? `Muggo, ${pose}`}
      style={[styles.img, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  img: { alignSelf: 'center' },
});
