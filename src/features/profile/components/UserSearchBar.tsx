import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Search, X } from "lucide-react-native";
import { cn } from "@/utils/cn";

interface UserSearchBarProps {
  onSearch: (userId: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const UserSearchBar = ({
  onSearch,
  isLoading = false,
  placeholder = "Search by User ID...",
  className,
}: UserSearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <View className={cn("flex-row items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-14 px-4 rounded-2xl shadow-sm", className)}>
      <Search size={20} color="#94A3B8" />
      <TextInput
        className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      {isLoading ? (
        <ActivityIndicator color="#208AEF" />
      ) : (
        query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <X size={20} color="#94A3B8" />
          </TouchableOpacity>
        )
      )}
    </View>
  );
};
