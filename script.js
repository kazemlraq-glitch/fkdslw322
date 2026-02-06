// المتغيرات العامة
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let debts = JSON.parse(localStorage.getItem('debts')) || [];

// تشغيل عند البدء
document.addEventListener('DOMContentLoaded', () => {
    // إخفاء شاشة الترحيب بعد 3 ثواني
    setTimeout(() => {
        document.getElementById('app').style.display = 'block';
    }, 3000);

    renderCustomers();
    renderDebts();
    updateCustomerSelect();
    syncData(); // محاولة المزامنة عند الفتح
});

// التنقل بين التبويبات
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// إدارة المودال
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('open');
}

// --- قسم الزبائن ---

async function saveCustomer() {
    const name = document.getElementById('new-customer-name').value;
    const phone = document.getElementById('new-customer-phone').value;

    if (!name || !phone) return alert('يرجى ملء الحقول');

    const newCustomer = {
        id: Date.now(), // ID مؤقت
        name: name,
        phone: phone,
        synced: false
    };

    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));
    
    // تحديث الواجهة
    renderCustomers();
    updateCustomerSelect();
    toggleModal('add-customer-modal');
    document.getElementById('new-customer-name').value = '';
    document.getElementById('new-customer-phone').value = '';

    // 🔴 التعديل هنا: الإرسال للجدول المرن dynamic_debts
    if (navigator.onLine) {
        // نضع البيانات داخل حقل اسمه data
        const payload = { type: 'customer', name: name, phone: phone };
        
        const { error } = await supabase
            .from('dynamic_debts') // اسم الجدول الجديد
            .insert([{ data: payload }]); // نرسل البيانات للحقل السحري

        if (!error) {
            newCustomer.synced = true;
            localStorage.setItem('customers', JSON.stringify(customers));
        } else {
            console.error('خطأ في Supabase:', error);
        }
    }
}

function renderCustomers() {
    const list = document.getElementById('customers-list');
    list.innerHTML = '';
    customers.forEach(c => {
        const div = document.createElement('div');
        div.className = 'glass-card list-item';
        div.innerHTML = `<span>${c.name}</span><span style="font-size:0.8em">${c.phone}</span>`;
        list.appendChild(div);
    });
}

function updateCustomerSelect() {
    const select = document.getElementById('sale-customer-select');
    select.innerHTML = '<option value="">اختر الزبون</option>';
    customers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.name; 
        option.textContent = c.name;
        select.appendChild(option);
    });
}

// --- قسم المبيعات والديون ---

async function addSale() {
    const customerName = document.getElementById('sale-customer-select').value;
    const item = document.getElementById('sale-item').value;
    const amount = document.getElementById('sale-amount').value;

    if (!customerName || !item || !amount) return alert('أكمل البيانات');

    // جلب رقم الهاتف
    const customer = customers.find(c => c.name === customerName);
    const phone = customer ? customer.phone : '';

    const newDebt = {
        id: Date.now(),
        customer_name: customerName,
        customer_phone: phone,
        item: item,
        amount: amount,
        date: new Date().toLocaleDateString('ar-IQ'),
        synced: false
    };

    debts.push(newDebt);
    localStorage.setItem('debts', JSON.stringify(debts));

    alert('تم حفظ البيع');
    document.getElementById('sale-item').value = '';
    document.getElementById('sale-amount').value = '';
    
    renderDebts();

    // 🔴 التعديل هنا: الإرسال للجدول المرن dynamic_debts
    if (navigator.onLine) {
        const payload = { 
            type: 'debt', 
            customer_name: customerName, 
            item: item, 
            amount: amount, 
            phone: phone,
            date: newDebt.date
        };

        const { error } = await supabase
            .from('dynamic_debts') // اسم الجدول الجديد
            .insert([{ data: payload }]); // نرسل البيانات للحقل السحري
            
        if (error) console.error('خطأ في Supabase:', error);
    }
}

function renderDebts() {
    const list = document.getElementById('debts-list');
    list.innerHTML = '';
    
    debts.forEach(d => {
        const div = document.createElement('div');
        div.className = 'glass-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <strong>${d.customer_name}</strong>
                <span style="color:#ff9f43">${d.amount} د.ع</span>
            </div>
            <p style="font-size:0.9em; opacity:0.8">${d.item} - ${d.date}</p>
            <button onclick="shareOnWhatsApp('${d.customer_name}', '${d.amount}', '${d.item}', '${d.customer_phone}')" class="glass-btn whatsapp">
                📩 مشاركة وصل التسديد
            </button>
        `;
        list.appendChild(div);
    });
}

// --- ميزة الواتساب ---
function shareOnWhatsApp(name, amount, item, phone) {
    if (!phone) return alert('لا يوجد رقم هاتف لهذا الزبون');
    
    const message = `
    *معرض كاظم البهادلي*
    -----------------------
    مرحباً أخي/أختي *${name}*
    تفاصيل القائمة المستحقة:
    📦 المادة: ${item}
    💰 المبلغ: ${amount}
    -----------------------
    شكراً لتعاملكم معنا.
    `.trim();

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// --- المزامنة الخلفية (Sync) ---
async function syncData() {
    if (!navigator.onLine) return;
    console.log('جاري المزامنة مع النظام المرن...');
}
