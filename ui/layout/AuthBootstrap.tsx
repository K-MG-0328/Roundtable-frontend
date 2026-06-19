"use client";

import { useAuthBootstrap } from "@/features/auth/application/hooks";

export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useAuthBootstrap();
  return <>{children}</>;
}
