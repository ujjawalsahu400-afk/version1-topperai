import React from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { cn } from "@/utils/cn";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onSelect: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
}

export const Select = ({
  label,
  value,
  onSelect,
  options,
  placeholder = "Select an option",
  error,
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 ml-1 text-sm">
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
        className={cn(
          "flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 border h-14 px-4 rounded-2xl",
          isOpen ? "border-primary" : "border-slate-200 dark:border-slate-800",
          error && "border-error"
        )}
      >
        <Text className={cn(
          "text-base",
          selectedOption ? "text-slate-900 dark:text-white" : "text-slate-400"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#94A3B8" />
      </TouchableOpacity>

      {error && (
        <Text className="text-error text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <View className="bg-white dark:bg-slate-900 rounded-t-[40px] px-6 pt-8 pb-12">
            <View className="items-center mb-6">
              <View className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </View>

            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-2">
              {label || "Select Option"}
            </Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex-row items-center justify-between p-4 rounded-2xl mb-2",
                    value === item.value ? "bg-primary/10 border border-primary/20" : "bg-slate-50 dark:bg-slate-800/50"
                  )}
                >
                  <Text className={cn(
                    "text-base font-medium",
                    value === item.value ? "text-primary" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {item.label}
                  </Text>
                  {value === item.value && <Check size={20} color="#208AEF" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
