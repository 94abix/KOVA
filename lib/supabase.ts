import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          video_url: string | null;
          thumbnail_url: string | null;
          duration_s: number;
          created_at: string;
          metrics_json: Record<string, unknown>;
          alerts_json: Array<{
            level: "info" | "attention" | "risque";
            text: string;
            recommendation: string;
            frames?: number[];
          }>;
          report_version: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_url?: string | null;
          thumbnail_url?: string | null;
          duration_s: number;
          created_at?: string;
          metrics_json: Record<string, unknown>;
          alerts_json: Array<{
            level: "info" | "attention" | "risque";
            text: string;
            recommendation: string;
            frames?: number[];
          }>;
          report_version: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_url?: string | null;
          thumbnail_url?: string | null;
          duration_s?: number;
          created_at?: string;
          metrics_json?: Record<string, unknown>;
          alerts_json?: Array<{
            level: "info" | "attention" | "risque";
            text: string;
            recommendation: string;
            frames?: number[];
          }>;
          report_version?: string;
        };
      };
      coach_links: {
        Row: {
          id: string;
          session_id: string;
          token: string;
          expires_at: string;
          created_at: string;
          revoked: boolean;
        };
        Insert: {
          id?: string;
          session_id: string;
          token: string;
          expires_at: string;
          created_at?: string;
          revoked?: boolean;
        };
        Update: {
          id?: string;
          session_id?: string;
          token?: string;
          expires_at?: string;
          created_at?: string;
          revoked?: boolean;
        };
      };
    };
  };
};

