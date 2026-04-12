import React from "react";
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { ThemeProvider } from './Themecontext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="weekly"
          options={{
            title: "Weekly",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="calendar.circle.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="meal-history"
          options={{
            title: "Meals",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="list.bullet" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="add-meal"
          options={{
            title: "Add",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="plus.circle.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}