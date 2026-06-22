import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NoteType } from "../types/note";
import { cn } from "@/utils/cn";

const TYPES: NoteType[] = ['Short', 'Detailed', 'Revision', 'Exam', 'Bullet'];

interface NotesTypeSelectorProps {
  selected: NoteType;
  onSelect: (type: NoteType) => void;
}

export const NotesTypeSelector = ({ selected, onSelect }: NotesTypeSelectorProps) => {
  return (
    <View className="mb-8">
      <Text className="text-slate-700 dark:text-slate-300 font-bold mb-4 ml-1">Select Note Style</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => onSelect(type)}
            className={cn(
              "px-6 py-3 rounded-2xl mr-3 border",
              selected === type
                ? "bg-primary border-primary"
                : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
            )}
          >
            <Text className={cn(
              "font-bold text-sm",
              selected === type ? "text-white" : "text-slate-500 dark:text-slate-400"
            )}>
              {type} Notes
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
