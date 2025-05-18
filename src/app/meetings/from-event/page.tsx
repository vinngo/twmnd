import { Suspense } from "react";
import FromCalendarClient from "./FromCalendarClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FromCalendarClient />
    </Suspense>
  );
}
