import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Settings, Trophy, Zap, CreditCard, ChevronRight, Share2, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout: clearStore } = useAuthStore();
  const { stats, loadProfile } = useProfileStore();
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.id) loadProfile(user.id);
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
    clearStore();
    router.replace('/(auth)/splash');
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-slate-50">
        <Text className="text-xl font-bold text-slate-900">Profile</Text>
        <TouchableOpacity className="p-2">
          <Settings size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* User Card */}
        <View className="mt-8 items-center">
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center border-4 border-white shadow-xl">
             <Text className="text-3xl font-bold text-primary">{user?.name?.charAt(0)}</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-900 mt-4">{user?.name}</Text>
          <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">ID: {user?.id?.slice(0, 10)}</Text>
        </View>

        {/* Level Stats */}
        <View className="mt-8 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
           <View className="flex-row justify-between items-end mb-4">
              <View>
                <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Current Progress</Text>
                <Text className="text-xl font-bold text-slate-900">Level {stats.level}</Text>
              </View>
              <Text className="text-slate-400 font-bold text-xs">{stats.xp % 1000}/1000 XP</Text>
           </View>
           <View className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <View style={{ width: `\${(stats.xp % 1000) / 10}%` }} className="h-full bg-primary" />
           </View>
        </View>

        {/* Quick Stats Grid */}
        <View className="flex-row mt-6 gap-4">
           <StatCard icon={Zap} color="#F59E0B" label="Streak" value={`\${stats.streak} Days`} />
           <StatCard icon={Trophy} color="#10B981" label="Coins" value={stats.coins.toString()} />
        </View>

        {/* Menu List */}
        <View className="mt-10">
           <MenuItem icon={CreditCard} label="Subscription Plan" value="Free" />
           <MenuItem icon={Share2} label="Share Profile" />
           <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center py-5 border-b border-slate-50"
           >
              <LogOut size={20} color="#EF4444" />
              <Text className="ml-4 font-bold text-[#EF4444] flex-1">Logout</Text>
           </TouchableOpacity>
        </View>
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}

function StatCard({ icon: Icon, color, label, value }: any) {
  return (
    <View className="flex-1 p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm items-center">
       <View style={{ backgroundColor: `\${color}15` }} className="w-10 h-10 rounded-xl items-center justify-center mb-3">
          <Icon size={20} color={color} />
       </View>
       <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{label}</Text>
       <Text className="text-lg font-bold text-slate-900 mt-1">{value}</Text>
    </View>
  );
}

function MenuItem({ icon: Icon, label, value }: any) {
  return (
    <TouchableOpacity className="flex-row items-center py-5 border-b border-slate-50">
       <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center">
          <Icon size={20} color="#64748B" />
       </View>
       <Text className="ml-4 font-bold text-slate-700 flex-1">{label}</Text>
       {value && <Text className="mr-3 text-primary font-bold text-sm">{value}</Text>}
       <ChevronRight size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );
}
