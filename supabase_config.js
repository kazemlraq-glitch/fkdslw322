// supabase_config.js
// استبدل الروابط أدناه بروابط مشروعك الخاص لكل عميل
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY";

// تهيئة العميل (يجب تضمين مكتبة supabase في الـ index.html)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase Config Loaded");
