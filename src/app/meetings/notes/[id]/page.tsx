"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useNotesStore } from "@/lib/stores/useNotesStore";

export default function NotesPage() {
  const { note } = useNotesStore();
  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Summary</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            {note?.summary || "Start recording to see a summary here!"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
