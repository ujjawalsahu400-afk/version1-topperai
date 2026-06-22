import React from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the browser to improve UX on native platforms
    // This method is not available on web and will throw an error
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
    }

    return () => {
      if (Platform.OS !== "web") {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};
