import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, MessageSquare, ThumbsUp, Plus, Share2, Filter } from 'lucide-react-native';
import { communityService, Post } from '@/services/community/communityService';
import { useAuthStore } from '@/store/authStore';

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'doubt' });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    const data = await communityService.getLatestPosts();
    setPosts(data);
    setIsLoading(false);
  };

  const handlePost = async () => {
    if (!newPost.title || !newPost.content) return;
    await communityService.createPost(user?.id!, user?.name!, newPost.title, newPost.content, newPost.type);
    setIsPosting(false);
    setNewPost({ title: '', content: '', type: 'doubt' });
    loadPosts();
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 border-b border-slate-50 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Users size={24} color="#6366F1" />
          <Text className="text-xl font-bold ml-3 text-slate-900">Community</Text>
        </View>
        <TouchableOpacity className="p-2">
           <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        {isPosting ? (
          <View className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
             <Text className="font-bold text-slate-900 mb-4">Post a Doubt or Note</Text>
             <TextInput
              placeholder="Title"
              className="bg-white p-4 rounded-2xl border border-slate-200 mb-3"
              value={newPost.title}
              onChangeText={t => setNewPost({...newPost, title: t})}
             />
             <TextInput
              placeholder="Content..."
              multiline
              className="bg-white p-4 rounded-2xl border border-slate-200 mb-4 min-h-[100px]"
              value={newPost.content}
              onChangeText={c => setNewPost({...newPost, content: c})}
             />
             <View className="flex-row gap-3">
                <TouchableOpacity onPress={handlePost} className="flex-1 bg-indigo-500 py-4 rounded-2xl items-center">
                   <Text className="text-white font-bold">Post to Community</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsPosting(false)} className="px-6 py-4 rounded-2xl border border-slate-200">
                   <Text className="text-slate-500 font-bold">Cancel</Text>
                </TouchableOpacity>
             </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setIsPosting(true)}
            className="flex-row items-center bg-indigo-50 p-6 rounded-[32px] mb-8 border border-indigo-100 shadow-sm"
          >
             <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
                <Plus size={24} color="#6366F1" />
             </View>
             <View className="ml-4">
                <Text className="text-indigo-900 font-bold text-lg">Ask the Community</Text>
                <Text className="text-indigo-500 font-medium">Share doubts or study resources</Text>
             </View>
          </TouchableOpacity>
        )}

        {isLoading ? (
          <ActivityIndicator color="#6366F1" className="mt-20" />
        ) : (
          posts.map(post => (
            <View key={post.id} className="bg-white p-6 rounded-[32px] border border-slate-100 mb-5 shadow-sm">
               <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center">
                     <Text className="text-indigo-500 font-bold">{post.userName?.charAt(0)}</Text>
                  </View>
                  <View className="ml-3">
                     <Text className="font-bold text-slate-900">{post.userName}</Text>
                     <Text className="text-[10px] text-slate-400 font-bold uppercase">{post.type}</Text>
                  </View>
               </View>
               <Text className="text-lg font-bold text-slate-900 mb-2">{post.title}</Text>
               <Text className="text-slate-600 leading-6 mb-6">{post.content}</Text>

               <View className="flex-row items-center justify-between pt-6 border-t border-slate-50">
                  <TouchableOpacity onPress={() => communityService.likePost(post.id)} className="flex-row items-center">
                     <ThumbsUp size={18} color="#64748B" />
                     <Text className="ml-2 text-slate-500 font-bold">{post.likes}</Text>
                  </TouchableOpacity>
                  <View className="flex-row items-center">
                     <MessageSquare size={18} color="#64748B" />
                     <Text className="ml-2 text-slate-500 font-bold">{post.commentsCount}</Text>
                  </View>
                  <TouchableOpacity>
                     <Share2 size={18} color="#64748B" />
                  </TouchableOpacity>
               </View>
            </View>
          ))
        )}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
