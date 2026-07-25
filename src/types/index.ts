export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface ThoughtItem {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
  concepts?: string[];
}
