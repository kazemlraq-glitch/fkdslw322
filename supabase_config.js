// supabase_config.js
// 1. رابط المشروع الخاص بك (من الصورة الثالثة)
const SUPABASE_URL = "https://qvfvdystksqzmzugddvj.supabase.co";

// 2. المفتاح العام الخاص بك (من الصورة الثالثة)
const SUPABASE_KEY = "sb_publishable_C8M1nnjNS5T6cp9ImtoE1A_HQPGCw2i";

// تهيئة الاتصال بقاعدة البيانات
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("تم تحميل إعدادات Supabase بنجاح - نسخة كاظم البهادلي");
