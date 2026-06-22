import React from "react";
import Markdown from "react-native-markdown-display";
import { StyleSheet, View } from "react-native";
import { THEME } from "@/constants/theme";

interface MarkdownRendererProps {
  content: string;
  isAi?: boolean;
}

export const MarkdownRenderer = ({ content, isAi }: MarkdownRendererProps) => {
  return (
    <View className="flex-1">
      <Markdown
        style={{
          body: {
            color: isAi ? "#1E293B" : "white",
            fontSize: 16,
            lineHeight: 22,
          },
          heading1: { fontWeight: "bold", marginVertical: 8 },
          bullet_list: { marginVertical: 4 },
          code_inline: {
            backgroundColor: isAi ? "#F1F5F9" : "rgba(255,255,255,0.2)",
            borderRadius: 4,
            padding: 2,
            fontFamily: "monospace",
          },
          fence: {
            backgroundColor: "#0F172A",
            borderRadius: 12,
            padding: 12,
            marginVertical: 8,
            color: "#F8FAFC",
          },
          table: {
            borderWidth: 1,
            borderColor: isAi ? "#E2E8F0" : "rgba(255,255,255,0.2)",
            borderRadius: 8,
            marginVertical: 8,
          },
        }}
      >
        {content}
      </Markdown>
    </View>
  );
};
