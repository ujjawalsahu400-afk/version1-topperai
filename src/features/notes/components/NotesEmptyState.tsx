import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";

export const NotesEmptyState = () => {
  const router = useRouter();

  return (
    <View className="items-center justify-center py-20 px-10">
      <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6">
        <BookOpen size={48} color="#208AEF" />
      </View>
      <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        No notes yet
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-center text-base leading-6 mb-8">
        Your AI-generated study notes will appear here. Start by creating your first note!
      </Text>
      <Button
        title="Generate New Notes"
        onPress={() => router.push("/(app)/notes/generate")}
        icon={<Plus size={20} color="white" />}
      />
    </View>
  );
};
