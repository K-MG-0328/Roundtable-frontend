"use client";

import { Provider } from "jotai";

import AuthBootstrap from "@/ui/layout/AuthBootstrap";
import AuthHeader from "@/ui/layout/AuthHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <AuthBootstrap>
        <header className="border-b border-black/10 px-8 py-3 dark:border-white/10 print:hidden">
          <div className="mx-auto max-w-3xl">
            <AuthHeader />
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
      </AuthBootstrap>
    </Provider>
  );
}
