import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Share, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Share2, Trash2, Copy, Download, FileDown } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Note } from "../types/note";
import { MarkdownRenderer } from "@/features/ai-chat/components/MarkdownRenderer";
import { Loader } from "@/components/ui/Loader";
import { useDeleteNote } from "../hooks/useNotes";
import { pdfGenerator } from "@/services/pdf/pdfGenerator";
import { Button } from "@/components/ui/Button";

export default function NotesViewerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { mutateAsync: deleteNote } = useDeleteNote();

  useEffect(() => {
    if (id) {
      getDoc(doc(db, "notes", id)).then((docSnap) => {
        if (docSnap.exists()) {
          setNote({ id: docSnap.id, ...docSnap.data() } as Note);
        }
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleCopy = async () => {
    if (note) {
      await Clipboard.setStringAsync(note.content);
      Alert.alert("Copied", "Notes copied to clipboard!");
    }
  };

  const handleShare = async () => {
    if (note) {
      await Share.share({
        message: `${note.title}\n\n${note.content}`,
        title: note.title,
      });
    }
  };

  const handleDownloadPdf = async () => {
    if (!note) return;

    setIsGeneratingPdf(true);
    try {
      const uri = await pdfGenerator.generateNotesPdf(note);
      await pdfGenerator.sharePdf(uri);
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete these notes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (note) {
              await deleteNote(note.id);
              router.back();
            }
          }
        },
      ]
    );
  };

  if (isLoading) return <Loader fullScreen />;
  if (!note) return <View className="flex-1 items-center justify-center"><Text>Note not found</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-50 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <ChevronLeft size={24} color="#64748B" />
        </TouchableOpacity>
        <View className="flex-row space-x-3">
          <TouchableOpacity onPress={handleCopy} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl items-center justify-center">
            <Copy size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl items-center justify-center">
            <Share2 size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="w-10 h-10 bg-error/10 rounded-xl items-center justify-center">
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-8 py-8" showsVerticalScrollIndicator={false}>
        <View className="bg-primary/5 self-start px-3 py-1 rounded-full mb-4">
          <Text className="text-primary font-bold text-[10px] uppercase tracking-widest">{note.type} Notes</Text>
        </View>
        <MarkdownRenderer content={note.content} isAi />
        <View className="h-32" />
      </ScrollView>

      {/* Floating Action Button for PDF */}
      <View className="absolute bottom-10 left-8 right-8">
        <Button
          title={isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
          onPress={handleDownloadPdf}
          isLoading={isGeneratingPdf}
          icon={<FileDown size={20} color="white" />}
          className="shadow-xl shadow-primary/40"
        />
      </View>
    </SafeAreaView>
  );
}
