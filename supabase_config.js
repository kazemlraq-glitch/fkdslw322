// supabase_config.js

// نستخدم var بدلاً من const لمنع مشاكل "already declared" عند إعادة التحميل
var SUPABASE_URL = "https://qvfvdystksqzmzugddvj.supabase.co";
var SUPABASE_KEY = "sb_publishable_C8M1nnjNS5T6cp9ImtoE1A_HQPGCw2i";

// نتحقق أولاً إذا كان المتغير موجوداً، لكي لا نعيد تعريفه
if (typeof supabase === 'undefined') {
    // إنشاء الاتصال فقط إذا لم يكن موجوداً
    var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("تم تحميل إعدادات Supabase بنجاح - نسخة كاظم البهادلي");
} else {
    console.log("Supabase متصل مسبقاً");
}
