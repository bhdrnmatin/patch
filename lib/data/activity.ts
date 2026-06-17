import { activitySections } from "@/lib/mock";
import type { ActivitySection } from "@/lib/types";

export async function getActivitySections(): Promise<ActivitySection[]> {
  return activitySections;
}
