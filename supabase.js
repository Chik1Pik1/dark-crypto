import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const SUPABASE_URL = "https://ynxkfuupkofvdcswuozq.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueGtmdXVwa29mdmRjc3d1b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTU0NjUsImV4cCI6MjA4MzgzMTQ2NX0.asHFgQUm_i1Y-noKYfwGDQwEU3Fji7mi1iUFE-QWaP0";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===== PRODUCTS =====
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products error:", error);
    return [];
  }

  return data;
}

// ===== ORDERS =====
export async function createOrder({
  product_id,
  amount,
  sender,
  receiver,
  comment = "",
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        product_id,
        amount,
        sender,
        receiver,
        comment,
        status: "paid",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Order error:", error);
    throw error;
  }

  return data;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Orders fetch error:", error);
    return [];
  }

  return data;
}
