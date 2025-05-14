import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function NotesPage() {
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
            Transcript is too short to generate a summary
          </p>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Your Notes</CardTitle>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 italic">
            Click 'Edit Notes' to add your own notes or provide instructions to
            regenerate summary (e.g. correct spellings to fix transcription
            errors)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
