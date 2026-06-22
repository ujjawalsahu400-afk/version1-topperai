import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Camera, School, ChevronRight } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";

const CLASS_OPTIONS = [
  { label: "Class 9", value: "9" },
  { label: "Class 10", value: "10" },
  { label: "Class 11", value: "11" },
  { label: "Class 12", value: "12" },
  { label: "Undergraduate", value: "UG" },
  { label: "Postgraduate", value: "PG" },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { updateProfile, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    class: "",
    school: "",
    profilePhoto: ""
  });
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profilePhoto: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!formData.class) {
      setError("Please select your class");
      return;
    }

    await updateProfile(formData);
    router.replace("/(app)/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
        <AuthHeader
          title="Setup Profile"
          subtitle="Tell us a bit more about your academics"
        />

        <View className="items-center mb-10">
          <TouchableOpacity
            onPress={pickImage}
            className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm overflow-hidden"
            activeOpacity={0.8}
          >
            {formData.profilePhoto ? (
              <Image source={{ uri: formData.profilePhoto }} className="w-full h-full" />
            ) : (
              <Camera size={40} color="#94A3B8" />
            )}
            <View className="absolute bottom-0 w-full bg-black/40 py-1 items-center">
              <Text className="text-[10px] text-white font-bold uppercase">Edit</Text>
            </View>
          </TouchableOpacity>
          <Text className="text-slate-500 dark:text-slate-400 mt-4 font-medium">
            Add Profile Photo
          </Text>
        </View>

        <View className="space-y-6">
          <Select
            label="Current Class"
            placeholder="Choose your class"
            value={formData.class}
            onSelect={(v) => {
              setFormData({ ...formData, class: v });
              setError(null);
            }}
            options={CLASS_OPTIONS}
            error={error || undefined}
          />

          <Input
            label="School / University (Optional)"
            placeholder="Enter your institution name"
            value={formData.school}
            onChangeText={(v) => setFormData({ ...formData, school: v })}
            icon={<School size={20} color="#94A3B8" />}
          />

          <View className="pt-8">
            <Button
              title="Complete Setup"
              onPress={handleSave}
              isLoading={isLoading}
              icon={<ChevronRight size={20} color="white" />}
              iconPosition="right"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
