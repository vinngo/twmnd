"use client";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HelpCircle, LogOut, Settings } from "lucide-react";
import { useMeetingsStore } from "@/lib/stores/useMeetingStore";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("memories");

  useEffect(() => {
    if (pathname.includes("/calendar")) {
      setActiveTab("calendar");
    } else if (pathname.includes("/questions")) {
      setActiveTab("questions");
    } else {
      setActiveTab("memories");
    }
  }, [pathname]);

  useEffect(() => {
    setActiveTab(activeTab);
  }, [activeTab]);

  const { user, fetchMeetingsData } = useMeetingsStore();
  useEffect(() => {
    fetchMeetingsData();
  }, [fetchMeetingsData]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <h1 className="text-xl font-bold">TwinMind</h1>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white pb-4">
        <div className="max-w-5xl mx-auto">
          <Tabs
            defaultValue={
              pathname.includes("/calendar")
                ? "calendar"
                : pathname.includes("/questions")
                  ? "questions"
                  : "memories"
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <Link href="/dashboard/memories" className="w-full">
                <TabsTrigger value="memories" className="w-full">
                  Memories
                </TabsTrigger>
              </Link>
              <Link href="/dashboard/calendar" className="w-full">
                <TabsTrigger value="calendar" className="w-full">
                  Calendar
                </TabsTrigger>
              </Link>
              <Link href="/dashboard/questions" className="w-full">
                <TabsTrigger value="questions" className="w-full">
                  Questions
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-white border-t py-3 px-4 sticky bottom-0">
        <div className="flex justify-between max-w-5xl mx-auto">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>

          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
