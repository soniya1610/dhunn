import { Image, View } from 'react-native';
import { palette } from '../constants/dhunTheme';

type Props = { uri?: string; size: number; radius?: number; seed?: string };

export default function Artwork({ uri, size, radius = 10, seed = '' }: Props) {
  const bg = palette[(seed.length + (seed.charCodeAt(0) || 0)) % palette.length];
  const style = { width: size, height: size, borderRadius: radius, backgroundColor: bg };
  if (!uri) return <View style={style} />;
  return <Image source={{ uri }} style={style} />;
}