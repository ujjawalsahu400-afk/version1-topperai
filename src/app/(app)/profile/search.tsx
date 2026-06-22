import React, { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserSearchBar } from "@/features/profile/components/UserSearchBar";
import { UserCard } from "@/features/profile/components/UserCard";
import { useUserSearch } from "@/hooks/useProfile";
import { useProfileStore } from "@/store/profileStore";
import { Search, UserX } from "lucide-react-native";

export default function SearchUserScreen() {
  const { mutate: search, isPending } = useUserSearch();
  const { searchedUser } = useProfileStore();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (userId: string) => {
    setHasSearched(true);
    search(userId);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
      <View className="px-8 pt-6 pb-4">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Search Users</Text>
        <UserSearchBar onSearch={handleSearch} isLoading={isPending} />
      </View>

      <ScrollView className="px-8 py-4">
        {searchedUser ? (
          <UserCard user={searchedUser} />
        ) : hasSearched && !isPending ? (
          <View className="items-center py-20">
            <View className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full items-center justify-center mb-4">
              <UserX size={40} color="#94A3B8" />
            </View>
            <Text className="text-slate-500 dark:text-slate-400 font-medium text-lg">No user found with that ID</Text>
          </View>
        ) : (
          <View className="items-center py-20">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
              <Search size={40} color="#208AEF" />
            </View>
            <Text className="text-slate-500 dark:text-slate-400 font-medium text-lg text-center">
              Enter a unique User ID to find other students and toppers.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
