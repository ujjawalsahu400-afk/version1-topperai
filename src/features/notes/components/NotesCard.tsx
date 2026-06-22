import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen, Calendar, ChevronRight, Clock } from "lucide-react-native";
import { Note } from "../types/note";
import { useRouter } from "expo-router";

interface NotesCardProps {
  note: Note;
}

export const NotesCard = ({ note }: NotesCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/notes/${note.id}`)}
      className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800 mb-4 shadow-sm"
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center">
          <BookOpen size={20} color="#208AEF" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-slate-900 dark:text-white font-bold text-base" numberOfLines={1}>
            {note.title}
          </Text>
          <View className="bg-slate-50 dark:bg-slate-800 self-start px-2 py-0.5 rounded-md mt-1">
            <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {note.type} • {note.source}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-slate-500 dark:text-slate-400 text-sm leading-5 mb-4" numberOfLines={2}>
        {note.content.replace(/[#*]/g, '').trim()}
      </Text>

      <View className="flex-row items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
        <View className="flex-row items-center">
          <Calendar size={14} color="#94A3B8" />
          <Text className="text-slate-400 text-[10px] ml-1.5 font-medium">
            {new Date(note.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <ChevronRight size={18} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );
};
