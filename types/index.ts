// Types for Karen's WebHouse
export interface DesignFlaw {
  issue: string;
  severity: "critical" | "high" | "medium" | "low";
  coordinates: { x: number; y: number; width: number; height: number };
  roast: string;
  recommendation: string;
}

export interface AnalysisResults {
  overall_rating: number;
  roast_summary: string;
  design_flaws: DesignFlaw[];
  positive_aspects: string[];
  karen_opening_line: string;
}

export interface RoastSession {
  sessionId: string;
  status: "processing" | "complete" | "error";
  progress: number;
  screenshot?: string;
  analysis?: AnalysisResults;
  url?: string;
  timestamp?: number;
}
