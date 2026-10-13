import { StyleSheet, useColorScheme, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { MUGGO, type MuggoPose } from '../assets/mascot/generated';
import { radius } from '../lib/theme';

// Muggo's limbs, steam and sparkles are off-white, so on the light background they vanish.
// In light mode Muggo sits on a navy panel (Muggo's own navy). In dark mode it needs none.
const PANEL = '#191B34';

type Props = {
  pose: MuggoPose;
  size?: number;
  label?: string;
};

export function Mascot({ pose, size = 140, label }: Props) {
  const dark = useColorScheme() === 'dark';
  const pad = Math.round(size * 0.06);
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label ?? `Muggo, ${pose}`}
      style={[
        styles.box,
        { width: size + pad * 2, height: size + pad * 2, padding: pad },
        !dark && { backgroundColor: PANEL, borderRadius: radius.lg },
      ]}
    >
      <SvgXml xml={MUGGO[pose]} width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
});
