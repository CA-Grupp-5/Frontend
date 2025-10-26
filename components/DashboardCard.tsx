import type { ReactNode, ComponentProps } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useThemeColors } from '@/hooks/useThemeColors';

type IconName = ComponentProps<typeof FontAwesome>['name'];

type AvatarConfig = {
  source: ImageSourcePropType;
  borderColor: string;
};

type IconConfig = {
  name: IconName;
  color: string;
  size?: number;
  backgroundColor: string;
};

type MetaConfig = {
  iconName: IconName;
  iconColor: string;
  text: string;
  textColor: string;
  label: string;
  labelColor: string;
};

type DashboardCardProps = {
  backgroundColor?: string;
  borderColor?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  title: string;
  titleColor?: string;
  subtitle: string;
  subtitleColor?: string;
  avatar?: AvatarConfig;
  icon?: IconConfig;
  meta?: MetaConfig;
  style?: StyleProp<ViewStyle>;
  extra?: ReactNode;
};

export default function DashboardCard({
  backgroundColor,
  borderColor,
  onPress,
  accessibilityLabel,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  avatar,
  icon,
  meta,
  style,
  extra,
}: DashboardCardProps) {
  const { colors } = useThemeColors();
  const cardBackground = backgroundColor ?? colors.surface;
  const cardBorderColor = borderColor ?? colors.border;
  const cardTitleColor = titleColor ?? colors.text;
  const cardSubtitleColor = subtitleColor ?? colors.mutedText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.cardRow, { backgroundColor: cardBackground, borderColor: cardBorderColor }, style]}
    >
      {renderLeading(avatar, icon)}
      <View style={styles.content}>
        <Text style={[styles.cardTitle, { color: cardTitleColor }]}>{title}</Text>
        {subtitle ? <Text style={[styles.cardSubtitle, { color: cardSubtitleColor }]}>{subtitle}</Text> : null}
        {meta ? (
          <View style={styles.metaRow}>
            <FontAwesome name={meta.iconName} size={14} color={meta.iconColor} />
            <Text style={[styles.metaText, { color: meta.textColor }]}>{meta.text}</Text>
            <Text style={[styles.metaLabel, { color: meta.labelColor }]}>{meta.label}</Text>
          </View>
        ) : null}
      </View>
      {extra}
    </Pressable>
  );
}

function renderLeading(avatar?: AvatarConfig, icon?: IconConfig) {
  if (avatar) {
    return (
      <View style={[styles.avatar, { borderColor: avatar.borderColor }]}>
        <Image source={avatar.source} style={styles.avatarImage} />
      </View>
    );
  }

  if (icon) {
    return (
      <View style={[styles.iconBadge, { backgroundColor: icon.backgroundColor }]}>
        <FontAwesome name={icon.name} size={icon.size ?? 18} color={icon.color} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  content: { flex: 1 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
  },
  avatarImage: { width: '100%', height: '100%' },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontWeight: '700', fontSize: 16 },
  cardSubtitle: { fontSize: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { marginLeft: 6, fontWeight: '700' },
  metaLabel: { marginLeft: 6, fontSize: 12 },
});
