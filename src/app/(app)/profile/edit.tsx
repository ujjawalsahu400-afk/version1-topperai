import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User, School, Hash, Type } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ProfileAvatar } from "@/features/profile/components/ProfileAvatar";
import { useAuthStore } from "@/store/authStore";
import { useProfile } from "@/hooks/useProfile";
import { validateName, validateUserId, validateBio } from "@/utils/profileValidation";
import { profileService } from "@/services/profile/profileService";

const CLASS_OPTIONS = [
  { label: "Class 9", value: "9" },
  { label: "Class 10", value: "10" },
  { label: "Class 11", value: "11" },
  { label: "Class 12", value: "12" },
  { label: "Undergraduate", value: "UG" },
  { label: "Postgraduate", value: "PG" },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, updateProfile, uploadPhoto, isUpdating, isUploading } = useProfile(user?.id);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    userId: profile?.userId || "",
    class: profile?.class || "",
    school: profile?.school || "",
    bio: profile?.bio || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && user?.id) {
      try {
        await uploadPhoto(result.assets[0].uri);
      } catch (e) {
        Alert.alert("Upload Failed", "Could not upload profile photo.");
      }
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    const newErrors: Record<string, string> = {};
    const nameErr = validateName(formData.name);
    const userIdErr = validateUserId(formData.userId);
    const bioErr = validateBio(formData.bio);

    if (nameErr) newErrors.name = nameErr;
    if (userIdErr) newErrors.userId = userIdErr;
    if (bioErr) newErrors.bio = bioErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Check User ID availability if changed
      if (formData.userId !== profile?.userId) {
        const isAvailable = await profileService.checkUserIdAvailability(formData.userId, user.id);
        if (!isAvailable) {
          setErrors({ userId: "User ID is already taken" });
          return;
        }
      }

      await updateProfile(formData);
      router.back();
    } catch (e) {
      Alert.alert("Error", "Could not update profile.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
          <AuthHeader title="Edit Profile" />

          <View className="items-center mb-10">
            <ProfileAvatar
              uri={profile?.photoUrl}
              size="xl"
              isEditable={true}
              onPress={handlePickImage}
              isLoading={isUploading}
            />
          </View>

          <View className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChangeText={(v) => setFormData({ ...formData, name: v })}
              error={errors.name}
              icon={<User size={20} color="#94A3B8" />}
            />

            <Input
              label="User ID"
              value={formData.userId}
              onChangeText={(v) => setFormData({ ...formData, userId: v })}
              error={errors.userId}
              icon={<Hash size={20} color="#94A3B8" />}
              autoCapitalize="none"
            />

            <Select
              label="Current Class"
              value={formData.class}
              onSelect={(v) => setFormData({ ...formData, class: v })}
              options={CLASS_OPTIONS}
            />

            <Input
              label="School / Institution"
              value={formData.school}
              onChangeText={(v) => setFormData({ ...formData, school: v })}
              icon={<School size={20} color="#94A3B8" />}
            />

            <Input
              label="Bio"
              value={formData.bio}
              onChangeText={(v) => setFormData({ ...formData, bio: v })}
              placeholder="Tell us something about yourself..."
              error={errors.bio}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              containerClassName="h-32"
              icon={<Type size={20} color="#94A3B8" />}
            />

            <Button
              title="Save Changes"
              onPress={handleSave}
              isLoading={isUpdating}
              className="mt-6 mb-12"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
