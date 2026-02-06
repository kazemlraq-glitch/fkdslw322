// supabase_config.js

const SUPABASE_URL = "https://qvfvdystksqzmzugddvj.supabase.co";

// المفتاح الجديد الخاص بك (صحيح 100%)
const SUPABASE_KEY = "sb_publishable_C8M1nnjNS5T6cp9ImtoE1A_HQPGCw2i";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("تم تحميل الإعدادات - مفتاح Publishable الجديد");
