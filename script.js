// ======================================================
// script.js - المنطق البرمجي لموقع دَوِّر
// ======================================================

// ---------- 1. مصفوفة تخزين الأدوات (بيانات مؤقتة في الذاكرة) ----------
// كل عنصر في المصفوفة هو "object" فيه معلومات الأداة
let items = [
    {
        name: "كتاب رياضيات - صف تاسع",
        category: "كتب",
        condition: "جيدة",
        method: "تبادل",
        price: null
    },
    {
        name: "طقم أدوات هندسية",
        category: "أدوات هندسية",
        condition: "ممتازة",
        method: "استعارة",
        price: null
    },
    {
        name: "قصة (ألف ليلة وليلة)",
        category: "قصص",
        condition: "مقبولة",
        method: "بيع",
        price: 10
    },
    {
        name: "مجسم مشروع علوم (نظام شمسي)",
        category: "مشاريع مدرسية",
        condition: "جيدة",
        method: "تبادل",
        price: null
    }
];

// ---------- 2. عناصر الصفحة (نحفظها في متغيرات عشان نستخدمها كتير) ----------
const navButtons = document.querySelectorAll(".nav-btn");
const heroButtons = document.querySelectorAll(".hero-buttons .btn");
const pages = document.querySelectorAll(".page");

const itemsContainer = document.getElementById("items-container");

const addItemForm = document.getElementById("add-item-form");
const methodSelect = document.getElementById("item-method");
const priceFieldWrapper = document.getElementById("price-field-wrapper");
const priceInput = document.getElementById("item-price");
const successMsg = document.getElementById("form-success-msg");


// ======================================================
// 3. التنقل بين الأقسام (Home / Browse / Add / About)
// ======================================================

// دالة تعرض قسم معين وتخفي الباقي
function showPage(pageId) {
    // نخفي كل الأقسام أولاً
    pages.forEach(function (page) {
        page.classList.remove("active-page");
    });

    // نظهر القسم المطلوب فقط
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active-page");
    }

    // نحدث شكل زر التنقل النشط في الأعلى
    navButtons.forEach(function (btn) {
        if (btn.dataset.target === pageId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // نرجع لأعلى الصفحة عند تغيير القسم
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// نربط كل أزرار شريط التنقل بحدث الضغط (click)
navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        showPage(btn.dataset.target);
    });
});

// نربط أزرار الصفحة الرئيسية (تصفح الأدوات / أضف أداة) بنفس الوظيفة
heroButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        showPage(btn.dataset.target);
    });
});


// ======================================================
// 4. عرض الأدوات كبطاقات (Cards) في قسم "تصفح الأدوات"
// ======================================================

// دالة ترجع اسم اللون/الكلاس المناسب حسب طريقة الحصول على الأداة
function getMethodClass(method) {
    if (method === "تبادل") return "method-exchange";
    if (method === "استعارة") return "method-borrow";
    if (method === "بيع") return "method-sale";
    return "";
}

// دالة تعرض كل الأدوات الموجودة في مصفوفة items داخل الصفحة
function renderItems() {
    // نفرّغ المحتوى الحالي قبل ما نعيد رسمه
    itemsContainer.innerHTML = "";

    items.forEach(function (item) {
        // ننشئ عنصر div جديد لكل أداة (بطاقة)
        const card = document.createElement("div");
        card.className = "item-card";

        // نجهز سطر السعر فقط لو الطريقة "سعر رمزي" وفيه سعر
        let priceHTML = "";
        if (item.method === "سعر رمزي" && item.price) {
            priceHTML = `<p class="item-price">السعر: ${item.price} جنيه</p>`;
        }

        // نبني محتوى البطاقة بصيغة HTML
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>الفئة: ${item.category}</p>
            <p>الحالة: ${item.condition}</p>
            ${priceHTML}
            <span class="method-badge ${getMethodClass(item.method)}">${item.method}</span>
        `;

        // نضيف البطاقة داخل الحاوية الرئيسية
        itemsContainer.appendChild(card);
    });
}

// أول ما تفتح الصفحة، نعرض الأدوات الافتراضية مباشرة
renderItems();


// ======================================================
// 5. إظهار/إخفاء حقل السعر حسب طريقة الحصول على الأداة
// ======================================================

methodSelect.addEventListener("change", function () {
    if (methodSelect.value === "سعر رمزي") {
        priceFieldWrapper.classList.remove("hidden");
    } else {
        priceFieldWrapper.classList.add("hidden");
        priceInput.value = ""; // نفرّغ السعر لو المستخدم غيّر رأيه
    }
});


// ======================================================
// 6. إضافة أداة جديدة عن طريق النموذج (Form)
// ======================================================

addItemForm.addEventListener("submit", function (event) {
    // نمنع الصفحة من إعادة التحميل (السلوك الافتراضي للنماذج)
    event.preventDefault();

    // نقرأ القيم اللي كتبها المستخدم
    const name = document.getElementById("item-name").value.trim();
    const category = document.getElementById("item-category").value;
    const condition = document.getElementById("item-condition").value;
    const method = methodSelect.value;

    // السعر يكون رقم فقط لو الطريقة "سعر رمزي"، وإلا يبقى فارغ (null)
    let price = null;
    if (method === "سعر رمزي" && priceInput.value) {
        price = Number(priceInput.value);
    }

    // نتأكد إن اسم الأداة مش فاضي (تحقق بسيط من المدخلات)
    if (name === "") {
        alert("من فضلك اكتب اسم الأداة.");
        return;
    }

    // ننشئ object جديد للأداة ونضيفه لمصفوفة items
    const newItem = {
        name: name,
        category: category,
        condition: condition,
        method: method,
        price: price
    };

    items.push(newItem);

    // نعيد رسم كل الأدوات عشان تظهر الأداة الجديدة في قسم التصفح
    renderItems();

    // نفرّغ النموذج ونخفي حقل السعر مرة ثانية
    addItemForm.reset();
    priceFieldWrapper.classList.add("hidden");

    // نظهر رسالة نجاح لمدة ثانيتين ثم نخفيها
    successMsg.classList.remove("hidden");
    setTimeout(function () {
        successMsg.classList.add("hidden");
    }, 2500);
});
