// supabase_config.js

// 1. رابط المشروع الخاص بك
var SUPABASE_URL = "https://qvfvdystksqzmzugddvj.supabase.co";

// 2. مفتاحك (وضعته لك هنا جاهزاً بناءً على صورتك)
var SUPABASE_KEY = "sb_publishable_C8M1nnjNS5T6cp9ImtoE1A_HQPGCw2i";

// 3. إنشاء الاتصال (بدون شروط if لضمان العمل)
// نستخدم window.supabase.createClient لأن المكتبة تكون محملة في window
var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 4. تعميم الاتصال ليستخدمه باقي الموقع
// نستبدل كائن المكتبة بكائن الاتصال المفتوح
window.supabase = client;

console.log("✅ تم تجهيز Supabase بالمفتاح الصحيح - كاظم البهادلي");
