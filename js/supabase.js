// js/supabase.js
const SUPABASE_URL = "https://ynxkfuupkofvdcswuozq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueGtmdXVwa29mdmRjc3d1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTU0NjUsImV4cCI6MjA4MzgzMTQ2NX0.asHFgQUm_i1Y-noKYfwGDQwEU3Fji7mi1iUFE-QWaP0";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);