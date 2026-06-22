import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, Plus, Trash2, Search, Sparkles } from 'lucide-react-native';
import { useNotesStore } from '@/store/notesStore';
import { useAuthStore } from '@/store/authStore';
import { NoteType } from '@/services/ai/notesService';
import { MarkdownRenderer } from '@/features/ai-chat/components/MarkdownRenderer';
import { cn } from '@/utils/cn';

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { savedNotes, isGenerating, generateAndSave, loadSavedNotes, deleteNote } = useNotesStore();

  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState('');
  const [selectedType, setSelectedType] = useState<NoteType>('detailed');
  const [viewingNote, setViewingNote] = useState<any>(null);

  useEffect(() => {
    if (user?.id) loadSavedNotes(user.id);
  }, [user?.id]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    await generateAndSave(user?.id!, topic, topic, selectedType);
    setIsCreating(false);
    setTopic('');
  };

  const noteTypes: { id: NoteType, label: string }[] = [
    { id: 'short', label: 'Short' },
    { id: 'detailed', label: 'Detailed' },
    { id: 'revision', label: 'Revision' },
    { id: 'bullet', label: 'Bullets' },
  ];

  if (viewingNote) {
    return (
      <View className="flex-1 bg-white dark:bg-slate-950" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
          <TouchableOpacity onPress={() => setViewingNote(null)}>
            <Text className="text-primary font-bold">Back</Text>
          </TouchableOpacity>
          <Text className="font-bold flex-1 text-center mx-4" numberOfLines={1}>{viewingNote.title}</Text>
          <TouchableOpacity onPress={() => { deleteNote(viewingNote.id); setViewingNote(null); }}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 px-6 pt-4">
          <MarkdownRenderer content={viewingNote.content} isAi />
          <View className="h-20" />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-950" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-slate-50 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <BookOpen size={24} color="#208AEF" />
          <Text className="text-xl font-bold ml-3 text-slate-900">AI Notes</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsCreating(true)}
          className="bg-primary/10 px-4 py-2 rounded-full"
        >
          <Text className="text-primary font-bold">+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        {isCreating && (
          <View className="mt-6 p-6 bg-slate-50 rounded-3xl border border-primary/20">
            <Text className="font-bold text-slate-900 mb-4 text-lg">Generate New Notes</Text>
            <TextInput
              className="bg-white p-4 rounded-2xl border border-slate-200 min-h-[100px]"
              placeholder="Enter topic or paste text..."
              multiline
              value={topic}
              onChangeText={setTopic}
            />
            <View className="flex-row flex-wrap gap-2 mt-4">
              {noteTypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  className={cn(
                    "px-4 py-2 rounded-full border",
                    selectedType === type.id ? "bg-primary border-primary" : "bg-white border-slate-200"
                  )}
                >
                  <Text className={cn("text-xs font-bold", selectedType === type.id ? "text-white" : "text-slate-500")}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={handleGenerate}
              disabled={isGenerating}
              className="bg-primary mt-6 py-4 rounded-2xl items-center flex-row justify-center"
            >
              {isGenerating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Sparkles size={18} color="white" className="mr-2" />
                  <Text className="text-white font-bold ml-2">Generate with AI</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsCreating(false)} className="mt-3 items-center">
              <Text className="text-slate-400 font-medium text-xs uppercase tracking-widest">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="mt-8">
          <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-[2px] mb-4">Saved Notes</Text>
          {savedNotes.map(note => (
            <TouchableOpacity
              key={note.id}
              onPress={() => setViewingNote(note)}
              className="flex-row items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm mb-3"
            >
              <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center">
                <BookOpen size={20} color="#64748B" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-bold text-slate-900" numberOfLines={1}>{note.title}</Text>
                <Text className="text-[10px] text-slate-400 font-bold uppercase mt-1">{note.type} • {new Date(note.createdAt).toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {savedNotes.length === 0 && !isGenerating && (
            <View className="items-center py-20">
              <Text className="text-slate-300 font-medium">No notes saved yet.</Text>
            </View>
          )}
        </View>
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
