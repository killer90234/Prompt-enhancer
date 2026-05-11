export interface EnhancementRequest {
  prompt: string;
  mode: EnhancementMode;
}

export interface EnhancementResponse {
  original_prompt: string;
  optimized_prompt: string;
  score: number;
  explanation: string;
  variants: Variant[];
  mode: EnhancementMode;
}

export interface Variant {
  text: string;
  score: number;
  explanation: string;
}

export enum EnhancementMode {
  STANDARD = "standard",
  CREATIVE = "creative",
  TECHNICAL = "technical",
  CONCISE = "concise",
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: Record<string, any>;
}