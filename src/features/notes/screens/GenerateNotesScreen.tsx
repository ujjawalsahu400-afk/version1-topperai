import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sparkles, FileText, Image as ImageIcon, Type, Layout } from "lucide-react-native";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { NotesTypeSelector } from "../components/NotesTypeSelector";
import { useNotesStore } from "@/store/notesStore";
import { NoteType, NoteSource } from "../types/note";
import { useAuthStore } from "@/store/authStore";
import * as ImagePicker from "expo-image-picker";

export default function GenerateNotesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { generateNote, saveNote, isLoading } = useNotesStore();

  const [topic, setTopic] = useState("");
  const [type, setType] = useState<NoteType>("Short");
  const [source, setSource] = useState<NoteSource>("Topic");
  const [uri, setUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      setUri(result.assets[0].uri);
      setSource("Image");
    }
  };

  const handleGenerate = async () => {
    if (!topic && source === "Topic") {
      Alert.alert("Error", "Please enter a topic.");
      return;
    }

    const content = await generateNote({ topic, type, source, uri: uri || undefined });

    if (content && user) {
      const title = topic || "New AI Note";
      await saveNote(user.id, {
        title,
        content,
        type,
        source,
        sourceUri: uri || "",
      });
      router.replace("/(app)/notes");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
          <AuthHeader title="Generate Notes" subtitle="AI will create structured notes for you" />

          <View className="mb-8">
            <Text className="text-slate-700 dark:text-slate-300 font-bold mb-4 ml-1">Input Source</Text>
            <View className="flex-row space-x-3">
              <SourceButton
                active={source === "Topic"}
                onPress={() => setSource("Topic")}
                icon={<Type size={20} color={source === "Topic" ? "white" : "#64748B"} />}
                label="Topic"
              />
              <SourceButton
                active={source === "Image"}
                onPress={handlePickImage}
                icon={<ImageIcon size={20} color={source === "Image" ? "white" : "#64748B"} />}
                label="Image"
              />
              <SourceButton
                active={source === "PDF"}
                onPress={() => setSource("PDF")}
                icon={<FileText size={20} color={source === "PDF" ? "white" : "#64748B"} />}
                label="PDF"
              />
            </View>
          </View>

          <Input
            label={source === "Topic" ? "What do you want to learn about?" : "Topic context (Optional)"}
            placeholder={source === "Topic" ? "e.g. Quantum Physics basics" : "e.g. Solve the problem in image"}
            value={topic}
            onChangeText={setTopic}
            icon={<Sparkles size={20} color="#94A3B8" />}
          />

          <NotesTypeSelector selected={type} onSelect={setType} />

          <Button
            title="Generate with AI"
            onPress={handleGenerate}
            isLoading={isLoading}
            icon={<Sparkles size={20} color="white" />}
            className="mt-6 mb-12 shadow-xl shadow-primary/30"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const SourceButton = ({ active, onPress, icon, label }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={cn(
      "flex-1 flex-row items-center justify-center p-4 rounded-2xl border",
      active ? "bg-primary border-primary" : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700"
    )}
  >
    {icon}
    <Text className={cn("ml-2 font-bold text-xs", active ? "text-white" : "text-slate-500")}>{label}</Text>
  </TouchableOpacity>
);

import { cn } from "@/utils/cn";
