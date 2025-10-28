import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export type AlertAction = {
  text: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
};

export interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  actions?: AlertAction[];
  onRequestClose?: () => void;
}

export default function CustomAlert({ visible, title, message, actions = [{ text: 'OK' }], onRequestClose }: CustomAlertProps) {
  const { colors, palette } = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={[styles.backdrop, { backgroundColor: palette.backdropOverlay }]}> 
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {!!title && (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          )}
          {!!message && (
            <Text style={[styles.message, { color: colors.mutedText }]}>{message}</Text>
          )}

          <View style={styles.actionsRow}>
            {actions.map((a, idx) => {
              const isPrimary = (a.variant ?? (idx === actions.length - 1 ? 'primary' : 'secondary')) === 'primary';
              return (
                <Pressable
                  key={idx}
                  accessibilityRole="button"
                  style={[
                    styles.actionBtn,
                    isPrimary
                      ? { backgroundColor: colors.tint, borderColor: colors.tint }
                      : { backgroundColor: 'transparent', borderColor: colors.border },
                  ]}
                  onPress={a.onPress}
                >
                  <Text
                    style={[
                      styles.actionText,
                      isPrimary ? { color: palette.gray900, fontWeight: '700' } : { color: colors.text },
                    ]}
                  >
                    {a.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'left',
  },
  message: {
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionText: {
    fontSize: 14,
  },
});

