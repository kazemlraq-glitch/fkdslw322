// المتغيرات العامة
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let debts = JSON.parse(localStorage.getItem('debts')) || [];
let appSettings = JSON.parse(localStorage.getItem('appSettings')) || {
    password: '1234' // كلمة المرور الافتراضية
};

// تشغيل عند البدء
document.addEventListener('DOMContentLoaded', () => {
    // إخفاء شاشة الترحيب بعد 3 ثواني ثم إظهار القفل
    setTimeout(() => {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('lock-screen').style.display = 'flex';
    }, 3000);

    renderCustomers();
    renderDebts();
    updateCustomerSelect();
    syncData(); 
});

// --- نظام القفل ---
function checkAppPassword() {
    const input = document.getElementById('app-password-input').value;
    if (input === appSettings.password) {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        showNotification('تم تسجيل الدخول بنجاح', 'success');
    } else {
        showNotification('كلمة المرور خاطئة!', 'error');
        // تفريغ الحقل
        document.getElementById('app-password-input').value = '';
    }
}

function changeAppPassword() {
    const current = document.getElementById('current-pass').value;
    const newPass = document.getElementById('new-pass').value;

    if (current === appSettings.password) {
        if (newPass.length >= 4) {
            appSettings.password = newPass;
            localStorage.setItem('appSettings', JSON.stringify(appSettings));
            showNotification('تم تغيير كلمة المرور بنجاح', 'success');
            document.getElementById('current-pass').value = '';
            document.getElementById('new-pass').value = '';
        } else {
            showNotification('كلمة المرور الجديدة قصيرة جداً', 'error');
        }
    } else {
        showNotification('كلمة المرور الحالية غير صحيحة', 'error');
    }
}

// --- نظام الإشعارات (بديل الـ alert) ---
function showNotification(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
    toast.innerHTML = `
        <span style="margin-left:10px; font-size:1.2em">${icon}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // إزالة العنصر من DOM بعد انتهاء الأنيميشن
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

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

function openCustomerModal(isEdit = false, customerId = null) {
    const modalTitle = document.getElementById('modal-title');
    const saveBtn = document.getElementById('save-customer-btn');
    const nameInput = document.getElementById('new-customer-name');
    const phoneInput = document.getElementById('new-customer-phone');
    const idInput = document.getElementById('customer-id-hidden');

    if (isEdit && customerId) {
        const cust = customers.find(c => c.id === customerId);
        if (cust) {
            modalTitle.textContent = "تعديل بيانات الزبون";
            saveBtn.textContent = "تحديث البيانات";
            nameInput.value = cust.name;
            // استخراج الرقم بدون الكود 
            // نفترض أنك خزنت الرقم كاملاً، هنا سنعرضه كما هو أو نعالجه
            phoneInput.value = cust.phone; 
            idInput.value = cust.id;
        }
    } else {
        modalTitle.textContent = "زبون جديد";
        saveBtn.textContent = "حفظ";
        nameInput.value = '';
        phoneInput.value = '';
        idInput.value = '';
    }
    toggleModal('add-customer-modal');
}


// --- قسم الزبائن ---

async function saveCustomer() {
    const id = document.getElementById('customer-id-hidden').value;
    const name = document.getElementById('new-customer-name').value;
    const phoneInput = document.getElementById('new-customer-phone').value;

    if (!name || !phoneInput) return showNotification('يرجى ملء كافة الحقول', 'error');

    // دمج الكود مع الرقم (إذا لم يكن موجوداً مسبقاً)
    // المستخدم يدخل 77xxxxxx -> النتيجة +96477xxxxxx
    // لكن للعرض في الجدول سنحتفظ به كما أدخله المستخدم أو نضيف الكود، حسب رغبتك.
    // سأقوم بحفظه كما هو لتسهيل التعديل، وعند الوتساب أضيف الكود.
    const phone = phoneInput; 

    if (id) {
        // --- وضع التعديل ---
        const index = customers.findIndex(c => c.id == id);
        if (index !== -1) {
            customers[index].name = name;
            customers[index].phone = phone;
            customers[index].synced = false;
            showNotification('تم تحديث بيانات الزبون', 'success');
        }
    } else {
        // --- وضع الإضافة ---
        const newCustomer = {
            id: Date.now(),
            name: name,
            phone: phone,
            synced: false
        };
        customers.push(newCustomer);
        showNotification('تم حفظ الزبون الجديد', 'success');
    }

    localStorage.setItem('customers', JSON.stringify(customers));
    
    // تحديث الواجهة
    renderCustomers();
    updateCustomerSelect();
    toggleModal('add-customer-modal');

    // إرسال لـ Supabase (للإضافة أو التعديل نرسل سجل جديد كـ Log حالياً لعدم تعقيد الكود)
    if (navigator.onLine) {
        const payload = { type: 'customer_update', name: name, phone: phone, action: id ? 'edit' : 'create' };
        const { error } = await supabase.from('dynamic_debts').insert([{ data: payload }]);
        if (error) console.error('Supabase Error:', error);
    }
}

function deleteCustomer(id) {
    if (confirm('هل أنت متأكد من حذف هذا الزبون؟ سيتم حذف سجلاته محلياً فقط.')) {
        customers = customers.filter(c => c.id !== id);
        localStorage.setItem('customers', JSON.stringify(customers));
        renderCustomers();
        updateCustomerSelect();
        showNotification('تم حذف الزبون', 'error');
    }
}

function renderCustomers() {
    const list = document.getElementById('customers-list');
    list.innerHTML = '';
    customers.forEach(c => {
        // حساب إجمالي الدين لهذا الزبون
        const totalDebt = debts
            .filter(d => d.customer_name === c.name)
            .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

        const div = document.createElement('div');
        div.className = 'glass-card list-item';
        div.innerHTML = `
            <div class="customer-header">
                <strong>${c.name}</strong>
                <span dir="ltr">+964 ${c.phone}</span>
            </div>
            <div class="customer-stats">
                💵 الدين الكلي: ${totalDebt.toLocaleString()} د.ع
            </div>
            <div class="customer-actions">
                <button onclick="openCustomerModal(true, ${c.id})" class="glass-btn btn-small primary">✏️ تعديل</button>
                <button onclick="deleteCustomer(${c.id})" class="glass-btn btn-small danger">🗑️ حذف</button>
            </div>
        `;
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
    const item = document.getElementById('sale-item').value; // الآن هو textarea
    const amount = document.getElementById('sale-amount').value;

    if (!customerName || !item || !amount) return showNotification('أكمل البيانات المطلوبة', 'error');

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

    showNotification('تم حفظ البيع بنجاح', 'success');
    
    // تفريغ الحقول
    document.getElementById('sale-item').value = '';
    document.getElementById('sale-amount').value = '';
    
    renderDebts();
    renderCustomers(); // لتحديث مجموع الديون

    if (navigator.onLine) {
        const payload = { 
            type: 'debt', 
            customer_name: customerName, 
            item: item, 
            amount: amount, 
            phone: phone,
            date: newDebt.date
        };
        const { error } = await supabase.from('dynamic_debts').insert([{ data: payload }]);
        if (error) console.error('Supabase Error:', error);
    }
}

function renderDebts() {
    const list = document.getElementById('debts-list');
    list.innerHTML = '';
    
    // ترتيب الديون من الأحدث للأقدم
    const sortedDebts = [...debts].reverse();

    sortedDebts.forEach(d => {
        // تحويل أسطر المادة إلى تنسيق HTML
        const formattedItem = d.item.replace(/\n/g, '<br>');

        const div = document.createElement('div');
        div.className = 'glass-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <strong>${d.customer_name}</strong>
                <span style="color:#ff9f43">${d.amount} د.ع</span>
            </div>
            <p style="font-size:0.9em; opacity:0.8; line-height:1.6;">${formattedItem}</p>
            <p style="font-size:0.8em; color:#ccc; margin-top:5px;">📅 ${d.date}</p>
            <button onclick="shareOnWhatsApp('${d.customer_name}', '${d.amount}', \`${d.item}\`, '${d.customer_phone}')" class="glass-btn whatsapp">
                📩 مشاركة وصل التسديد
            </button>
        `;
        list.appendChild(div);
    });
}

// --- ميزة الواتساب ---
function shareOnWhatsApp(name, amount, item, phone) {
    if (!phone) return showNotification('لا يوجد رقم هاتف لهذا الزبون', 'error');
    
    // إضافة كود الدولة العراقية
    const fullPhone = '964' + phone.replace(/^0+/, ''); // إزالة الصفر في البداية إن وجد

    const message = `
    *معرض كاظم البهادلي*
    -----------------------
    مرحباً أخي/أختي *${name}*
    تفاصيل القائمة المستحقة:
    
    ${item}
    
    💰 المبلغ الكلي: ${amount}
    -----------------------
    شكراً لتعاملكم معنا.
    `.trim();

    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// --- النسخ الاحتياطي ---

function downloadBackup() {
    const data = {
        customers: customers,
        debts: debts,
        date: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backup_kazem_" + Date.now() + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function uploadBackup() {
    const input = document.getElementById('backup-file');
    if (!input.files.length) return showNotification('يرجى اختيار ملف أولاً', 'error');

    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.customers && data.debts) {
                customers = data.customers;
                debts = data.debts;
                localStorage.setItem('customers', JSON.stringify(customers));
                localStorage.setItem('debts', JSON.stringify(debts));
                
                renderCustomers();
                renderDebts();
                updateCustomerSelect();
                showNotification('تم استعادة النسخة بنجاح', 'success');
            } else {
                showNotification('ملف غير صالح', 'error');
            }
        } catch (err) {
            showNotification('حدث خطأ أثناء قراءة الملف', 'error');
        }
    };
    reader.readAsText(file);
}

// --- المزامنة الخلفية (Sync) ---
async function syncData() {
    if (!navigator.onLine) return;
    console.log('جاري المزامنة مع النظام المرن...');
}
