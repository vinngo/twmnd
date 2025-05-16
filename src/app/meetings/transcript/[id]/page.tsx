import { Card, CardContent } from "@/components/ui/card";

export default function TranscriptsPage() {
  // Mock transcript data
  const transcript = [
    {
      speaker: "Alex",
      text: "Good morning everyone, thanks for joining our weekly sync. Let's start by going around and sharing updates.",
      timestamp: "00:00:15",
    },
    {
      speaker: "Sarah",
      text: "I've completed the design mockups for the new feature. I'll share them after the meeting for feedback.",
      timestamp: "00:01:30",
    },
    {
      speaker: "David",
      text: "The backend team has made good progress on the API endpoints. We're about 70% complete.",
      timestamp: "00:02:45",
    },
    {
      speaker: "Maria",
      text: "QA has identified 3 critical bugs in the payment processing system that need immediate attention.",
      timestamp: "00:04:10",
    },
    {
      speaker: "Alex",
      text: "Thanks for the updates. Let's discuss the timeline for the feature launch. Given the bugs, should we consider postponing?",
      timestamp: "00:05:30",
    },
    {
      speaker: "David",
      text: "I think we should postpone by a week to ensure quality. We can use the extra time to fix the bugs and complete the API work.",
      timestamp: "00:06:45",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Transcript</h2>
        <div className="space-y-3">
          {transcript.map((entry, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{entry.speaker}</span>
                  <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                    {entry.timestamp}
                  </span>
                </div>
                <p className="text-sm">{entry.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
