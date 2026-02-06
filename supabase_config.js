// supabase_config.js
// استبدل الروابط أدناه بروابط مشروعك الخاص لكل عميل
const SUPABASE_URL = "https://qvfvdystksqzmzugddvj.supabase.co";
const SUPABASE_KEY = "qvfvdystksqzmzugddvj";

// تهيئة العميل (يجب تضمين مكتبة supabase في الـ index.html)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase Config Loaded");
