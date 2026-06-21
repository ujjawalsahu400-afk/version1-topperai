import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import { cn } from "@/utils/cn";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal = ({
  isVisible,
  onClose,
  title,
  children,
  footer,
  className,
}: ModalProps) => {
  return (
    <RNModal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/60 justify-end md:justify-center p-0 md:p-10">
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className={cn(
                "bg-white dark:bg-slate-900 rounded-t-[40px] md:rounded-[40px] overflow-hidden",
                className
              )}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center"
                >
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View className="p-8">{children}</View>

              {/* Footer */}
              {footer && (
                <View className="px-8 pb-10 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {footer}
                </View>
              )}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};
