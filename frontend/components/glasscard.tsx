import React from "react";
import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function GlassCard({ children }: any) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={35} tint="light" style={styles.blur}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
  },

  blur: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  inner: {
    borderRadius: 18,
  },
});