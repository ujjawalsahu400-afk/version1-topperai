import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import {
  Plus,
  MessageSquare,
  BookOpen,
  LayoutGrid,
  Trophy,
  Calendar,
  Users,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  CreditCard
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useAIChatStore } from '@/store/aiChatStore';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { THEME } from '@/constants/theme';
import { cn } from '@/utils/cn';

export function DrawerContent(props: any) {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user, logout: clearStore } = useAuthStore();
  const { chatHistory, loadHistory, createNewChat, currentChatId } = useAIChatStore();

  useEffect(() => {
    if (user?.id) {
      loadHistory(user.id);
    }
  }, [user?.id]);

  const handleNewChat = () => {
    createNewChat();
    props.navigation.closeDrawer();
    router.push('/(app)/ai-chat');
  };

  const navigateTo = (path: string) => {
    props.navigation.closeDrawer();
    router.push(path as any);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      clearStore();
      props.navigation.closeDrawer();
      router.replace('/(auth)/splash');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const groupHistory = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = today - 86400000;
    const last7Days = today - (86400000 * 7);

    return {
      today: chatHistory.filter(c => c.updatedAt >= today),
      yesterday: chatHistory.filter(c => c.updatedAt >= yesterday && c.updatedAt < today),
      older: chatHistory.filter(c => c.updatedAt < yesterday)
    };
  };

  const history = groupHistory();

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <ScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View className="px-4 py-6">
          {/* New Chat Button */}
          <TouchableOpacity
            onPress={handleNewChat}
            className="flex-row items-center justify-between bg-primary/10 p-4 rounded-2xl border border-primary/20"
          >
            <View className="flex-row items-center">
              <Plus size={20} color={THEME.colors.primary} />
              <Text className="ml-3 font-bold text-primary">New Chat</Text>
            </View>
            <Sparkles size={16} color={THEME.colors.primary} />
          </TouchableOpacity>

          {/* Chat History */}
          <View className="mt-8">
            <HistorySection
              title="Today"
              chats={history.today}
              currentChatId={currentChatId}
              onSelect={(id) => {
                useAIChatStore.getState().loadChat(id, user?.id!);
                props.navigation.closeDrawer();
                router.push('/(app)/ai-chat');
              }}
            />
            <HistorySection
              title="Yesterday"
              chats={history.yesterday}
              currentChatId={currentChatId}
              onSelect={(id) => {
                useAIChatStore.getState().loadChat(id, user?.id!);
                props.navigation.closeDrawer();
                router.push('/(app)/ai-chat');
              }}
            />
          </View>

          {/* Features */}
          <View className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Text className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Features</Text>
            <DrawerItem icon={BookOpen} label="Notes Generator" onPress={() => navigateTo('/(app)/notes')} />
            <DrawerItem icon={LayoutGrid} label="Quiz Generator" onPress={() => navigateTo('/(app)/quiz')} />
            <DrawerItem icon={Trophy} label="Mock Tests" onPress={() => navigateTo('/(app)/mock-tests')} />
            <DrawerItem icon={Calendar} label="Study Planner" onPress={() => navigateTo('/(app)/study-planner')} />
            <DrawerItem icon={Users} label="Community" onPress={() => navigateTo('/(app)/community')} />
            <DrawerItem icon={BarChart2} label="Analytics" onPress={() => navigateTo('/(app)/analytics')} />
          </View>
        </View>
      </ScrollView>

      {/* Footer / Profile Section */}
      <View className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <TouchableOpacity
          onPress={() => navigateTo('/(app)/profile')}
          className="flex-row items-center p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 mb-4"
        >
          <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
            <Text className="text-primary font-bold">{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-bold text-slate-900 dark:text-white" numberOfLines={1}>{user?.name || 'User'}</Text>
            <Text className="text-[10px] text-slate-500 font-medium">Pro Plan • ID: {user?.id?.slice(0, 8)}</Text>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-between px-2">
          <TouchableOpacity onPress={() => navigateTo('/(app)/settings')} className="p-2">
            <Settings size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <CreditCard size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} className="p-2">
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function HistorySection({ title, chats, currentChatId, onSelect }: { title: string, chats: any[], currentChatId: string | null, onSelect: (id: string) => void }) {
  if (chats.length === 0) return null;
  return (
    <View className="mb-6">
      <Text className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{title}</Text>
      {chats.map(chat => (
        <TouchableOpacity
          key={chat.id}
          onPress={() => onSelect(chat.id)}
          className={cn(
            "flex-row items-center px-3 py-2.5 rounded-xl mb-1",
            currentChatId === chat.id ? "bg-slate-100 dark:bg-slate-800" : ""
          )}
        >
          <MessageSquare size={16} color={currentChatId === chat.id ? THEME.colors.primary : "#94A3B8"} />
          <Text
            className={cn(
              "ml-3 text-sm flex-1",
              currentChatId === chat.id ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-400"
            )}
            numberOfLines={1}
          >
            {chat.title || 'Untitled Chat'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function DrawerItem({ icon: Icon, label, onPress }: { icon: any, label: string, onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-3 py-3 rounded-xl mb-1"
    >
      <Icon size={20} color="#64748B" />
      <Text className="ml-4 text-slate-700 dark:text-slate-300 font-medium">{label}</Text>
    </TouchableOpacity>
  );
}
