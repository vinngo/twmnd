import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  SquareMIcon as MicSquare,
  HelpCircle,
  Settings,
  LogOut,
  Clock,
  MessageSquare,
} from "lucide-react";

export default function DashboardPage() {
  // Mock data for meetings grouped by date
  const meetingGroups = [
    {
      date: "Today",
      meetings: [
        {
          id: "1",
          title: "Weekly Team Sync",
          time: "10:00 AM",
          duration: "60 min",
        },
        {
          id: "2",
          title: "Product Review",
          time: "2:00 PM",
          duration: "45 min",
        },
      ],
    },
    {
      date: "Yesterday",
      meetings: [
        {
          id: "3",
          title: "Marketing Strategy",
          time: "3:00 PM",
          duration: "30 min",
        },
      ],
    },
    {
      date: "May 10, 2025",
      meetings: [
        {
          id: "4",
          title: "Client Presentation",
          time: "11:00 AM",
          duration: "60 min",
        },
        {
          id: "5",
          title: "Team Retrospective",
          time: "2:00 PM",
          duration: "45 min",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <h1 className="text-xl font-bold">TwinMind</h1>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="memories">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="memories">Memories</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
        {/* Search and Capture */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search memories..." className="pl-9" />
          </div>

          <Link href="/meetings/new">
            <Button className="flex items-center gap-2">
              <MicSquare className="h-4 w-4" />
              <span>Capture</span>
            </Button>
          </Link>
        </div>

        {/* Meeting Groups */}
        <div className="space-y-6">
          {meetingGroups.map((group) => (
            <div key={group.date}>
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                {group.date}
              </h2>

              <div className="space-y-2">
                {group.meetings.map((meeting) => (
                  <Link href={`/meetings/${meeting.id}`} key={meeting.id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{meeting.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{meeting.time}</span>
                              <span className="mx-1">•</span>
                              <span>{meeting.duration}</span>
                            </div>
                          </div>
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

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
