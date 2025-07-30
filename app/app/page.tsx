
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { WalletConnection } from "@/components/chat/wallet-connection";
import { SocketProvider } from "@/components/providers/socket-provider";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  return (
    <SocketProvider>
      <div className="h-screen flex flex-col">
        <WalletConnection />
        <div className="flex-1">
          <ChatLayout />
        </div>
      </div>
    </SocketProvider>
  );
}
