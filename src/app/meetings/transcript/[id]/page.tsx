"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranscriptStore } from "@/lib/stores/useTranscriptStore";

export default function TranscriptsPage() {
  const { transcripts } = useTranscriptStore();

  function formatToHourMinute(ts: string): string {
    // 1) Pull out hours & minutes
    const match = ts.match(/(\d{2}):(\d{2}):\d{2}/);
    if (!match) {
      throw new Error(`Invalid timestamp format: "${ts}"`);
    }
    const [, hour, minute] = match; // match[1] = hour, match[2] = minute

    // 2) Return formatted string
    return `${hour}:${minute}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Transcript</h2>
        <div className="space-y-3">
          {transcripts?.map((entry, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                    {formatToHourMinute(entry.timestamp)}
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
