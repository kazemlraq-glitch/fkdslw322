// supabase_config.js
// استبدل الروابط أدناه بروابط مشروعك الخاص لكل عميل
const SUPABASE_URL = "https://qvfvdystksqzmzugddvj.supabase.co";
const SUPABASE_KEY = "sb_publishable_C8M1nnjNS5T6cp9ImtoE1A_HQPGCw2i";

// تهيئة العميل (يجب تضمين مكتبة supabase في الـ index.html)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase Config Loaded");
