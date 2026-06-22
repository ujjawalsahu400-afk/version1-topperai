import React from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Search, Filter } from "lucide-react-native";
import { useRouter } from "expo-router";
import { NotesCard } from "../components/NotesCard";
import { useUserNotes } from "../hooks/useNotes";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "@/components/ui/Loader";
import { NotesEmptyState } from "../components/NotesEmptyState";

export default function NotesHomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: notes, isLoading, refetch } = useUserNotes(user?.id || "");

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
      <View className="px-8 pt-6 pb-4 bg-white dark:bg-slate-900 rounded-b-[40px] shadow-sm">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white">My Notes</Text>
          <TouchableOpacity
            onPress={() => router.push("/(app)/notes/generate")}
            className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/30"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row space-x-3 mb-4">
          <TouchableOpacity className="flex-1 flex-row items-center bg-slate-50 dark:bg-slate-800 h-12 px-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Search size={18} color="#94A3B8" />
            <Text className="ml-2 text-slate-400 text-sm">Search notes...</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl items-center justify-center border border-slate-100 dark:border-slate-700">
            <Filter size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-8 py-6"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {isLoading ? (
          <Loader />
        ) : notes && notes.length > 0 ? (
          notes.map((note) => <NotesCard key={note.id} note={note} />)
        ) : (
          <NotesEmptyState />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
