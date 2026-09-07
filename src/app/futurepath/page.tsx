import type { Metadata } from "next";
import { FuturePathClient } from "@/components/FuturePathClient";

export const metadata: Metadata = {
  title: "FuturePath — BCA FutureTry",
  description: "Learn, Ask, Check, Connect, Act — jembatan dari rasa penasaran menuju langkah yang yakin.",
};

export default function FuturePathPage() {
  return <FuturePathClient />;
}
