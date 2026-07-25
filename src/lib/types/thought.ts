export interface ThoughtItem {
  id: string;
  userId: string;
  rawContent: string;
  summary: string | null;
  entities: string[];
  isArchived: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };
