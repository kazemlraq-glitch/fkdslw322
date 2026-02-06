// supabase_config.js

// نستخدم var بدلاً من const لمنع مشاكل التكرار
var SUPABASE_URL = "https://qvfvdystksqzmzugddvj.supabase.co";
var SUPABASE_KEY = "sb_publishable_C8M1nnjNS5T6cp9ImtoE1A_HQPGCw2i";

// فحص ما إذا كان supabase معرفاً مسبقاً لتجنب إعادة التعريف
if (typeof supabase === 'undefined') {
    var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("تم تحميل إعدادات Supabase بنجاح");
} else {
    console.log("Supabase محمل مسبقاً");
}
