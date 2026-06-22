import { QueryProvider } from "./QueryProvider";
import { ClerkProvider } from "./ClerkProvider";
import { AuthProvider } from "./AuthProvider";
import { type ReactNode } from "react";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ClerkProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ClerkProvider>
    </QueryProvider>
  );
}
