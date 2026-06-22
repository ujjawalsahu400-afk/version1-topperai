import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Mail, Bell, Search, BookOpen } from "lucide-react-native";

export default function DesignSystemScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView className="flex-1 px-6 py-8">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Design System
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 mb-10">
          Premium UI Components for TopperAI
        </Text>

        {/* Buttons Section */}
        <Section title="Buttons">
          <View className="flex-row flex-wrap gap-4">
            <Button title="Primary" className="flex-1" />
            <Button title="Secondary" variant="secondary" className="flex-1" />
          </View>
          <View className="flex-row flex-wrap gap-4 mt-4">
            <Button title="Outline" variant="outline" className="flex-1" />
            <Button title="Ghost" variant="ghost" className="flex-1" />
          </View>
          <Button
            title="With Icon"
            className="mt-4"
            icon={<Bell size={20} color="white" />}
          />
        </Section>

        {/* Inputs Section */}
        <Section title="Inputs">
          <Input
            label="Email Address"
            placeholder="enter your email"
            icon={<Mail size={20} color="#94A3B8" />}
          />
          <Input
            label="Search"
            placeholder="Search notes..."
            icon={<Search size={20} color="#94A3B8" />}
            error="Search query is too short"
          />
        </Section>

        {/* Cards & Badges */}
        <Section title="Cards & Badges">
          <Card variant="elevated">
            <View className="flex-row justify-between items-start mb-4">
              <Badge label="New Feature" variant="success" />
              <Badge label="Limited" variant="warning" />
            </View>
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              AI Mock Paper
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 mb-6">
              Generate a full-length mock exam tailored to your weak areas.
            </Text>
            <Button title="Try Now" variant="outline" size="sm" />
          </Card>
        </Section>

        {/* Avatars */}
        <Section title="Avatars">
          <View className="flex-row items-center gap-6">
            <Avatar fallback="Ujjawal" size="xl" />
            <Avatar fallback="John Doe" size="lg" />
            <Avatar fallback="AI" size="md" />
            <Avatar fallback="S" size="sm" />
          </View>
        </Section>

        {/* Modal Toggle */}
        <Section title="Modals">
          <Button
            title="Open Premium Modal"
            variant="secondary"
            onPress={() => setIsModalVisible(true)}
          />
          <Modal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            title="Start New Quiz"
            footer={
              <View className="flex-row gap-4">
                <Button title="Cancel" variant="outline" className="flex-1" onPress={() => setIsModalVisible(false)} />
                <Button title="Create" className="flex-1" onPress={() => setIsModalVisible(false)} />
              </View>
            }
          >
            <Text className="text-slate-600 dark:text-slate-400">
              Select a topic from your library to generate an AI-powered quiz.
            </Text>
          </Modal>
        </Section>

        {/* Empty State */}
        <Section title="Empty States">
          <Card className="h-64">
            <EmptyState
              icon={BookOpen}
              title="No Notes Found"
              description="You haven't generated any notes yet. Start by uploading a PDF."
              actionTitle="Create Note"
              onAction={() => {}}
            />
          </Card>
        </Section>

        {/* Loaders */}
        <Section title="Loaders">
          <Loader message="Generating AI responses..." />
        </Section>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-10">
      <Text className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
        {title}
      </Text>
      {children}
    </View>
  );
}
