// Admin Şifresi
const ADMIN_PASSWORD_HASH = 'ryuji_takeda_shingen_tengen_fyukui';

// Uygulama Durumu (State)
let products = [];
let deleteTargetId = null;
let currentEditingId = null;

// Görünüm Değiştirme Fonksiyonu
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    if(viewId === 'userView' || viewId === 'adminView') {
        renderProducts();
    }
    // İkonları yeniden yükle
    lucide.createIcons();
}

// Admin Girişi
function handleAdminLogin() {
    const pass = document.getElementById('adminPassword').value;
    if (pass === ADMIN_PASSWORD_HASH) {
        showView('adminView');
        document.getElementById('adminPassword').value = '';
    } else {
        alert('❌ Səhv admin şifrəsi!');
    }
}

// Çıkış Yap
function logout() {
    showView('roleSelectView');
}

// Formu Aç/Kapat
function toggleAddForm() {
    const form = document.getElementById('addForm');
    const btn = document.getElementById('toggleFormBtn');
    form.classList.toggle('hidden');
    
    if (form.classList.contains('hidden')) {
        btn.innerHTML = '<i data-lucide="plus"></i> Yeni Məhsul Əlavə Et';
    } else {
        btn.innerHTML = '<i data-lucide="x"></i> Bağla';
    }
    lucide.createIcons();
}

// Resim Yükleme İşlemi (Dosya Okuyucu)
let tempImageData = "";
function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            tempImageData = e.target.result;
            if(type === 'new') {
                document.getElementById('newImageUrl').value = "Fayl seçildi ✅";
            }
        };
        reader.readAsDataURL(file);
    }
}

// Ürün Ekleme
function addProduct() {
    const name = document.getElementById('newName').value;
    const price = document.getElementById('newPrice').value;
    const url = document.getElementById('newImageUrl').value;
    
    const image = tempImageData || url;

    if (name && price && image && image !== "Fayl seçildi ✅") {
        const product = {
            id: Date.now(),
            name: name,
            price: parseFloat(price),
            image: image
        };
        products.push(product);
        
        // Formu sıfırla
        document.getElementById('newName').value = '';
        document.getElementById('newPrice').value = '';
        document.getElementById('newImageUrl').value = '';
        tempImageData = "";
        
        toggleAddForm();
        renderProducts();
    } else {
        alert('⚠️ Zəhmət olmasa bütün sahələri doldurun!');
    }
}

// Ürünleri Ekrana Bas
function renderProducts() {
    // Kullanıcı Menüsü
    const userGrid = document.getElementById('userProductGrid');
    const userEmpty = document.getElementById('userEmptyState');
    
    if(products.length === 0) {
        userEmpty.style.display = 'block';
        userGrid.innerHTML = '';
    } else {
        userEmpty.style.display = 'none';
        userGrid.innerHTML = products.map(p => `
            <div class="product-card">
                <img src="${p.image}" class="card-img" alt="${p.name}">
                <div class="card-body">
                    <h3>${p.name}</h3>
                    <div class="flex-between mt-20">
                        <span class="card-price">₼${p.price.toFixed(2)}</span>
                        <button class="btn btn-red btn-sm" style="border-radius: 50%; padding: 10px;">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Admin Listesi
    const adminList = document.getElementById('adminProductList');
    document.getElementById('productCount').innerText = products.length;
    
    adminList.innerHTML = products.map(p => {
        if(currentEditingId === p.id) {
            return `
                <div class="admin-item" style="flex-direction: column; align-items: stretch; border-color: #2563eb;">
                    <div class="form-grid">
                        <input type="text" id="editName-${p.id}" value="${p.name}">
                        <input type="number" id="editPrice-${p.id}" value="${p.price}" step="0.01">
                        <input type="text" id="editUrl-${p.id}" value="${p.image}">
                    </div>
                    <div class="flex-between mt-10">
                        <button onclick="saveEdit(${p.id})" class="btn btn-green">Saxla</button>
                        <button onclick="cancelEdit()" class="btn btn-gray">Ləğv</button>
                    </div>
                </div>
            `;
        }
        return `
            <div class="admin-item">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${p.image}">
                    <div>
                        <div style="font-weight: bold;">${p.name}</div>
                        <div style="color: #ef4444;">₼${p.price.toFixed(2)}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="startEdit(${p.id})" class="btn btn-gray btn-sm">Düzəliş</button>
                    <button onclick="openDeleteModal(${p.id})" class="btn btn-red btn-sm">Sil</button>
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

// Düzenleme Fonksiyonları
function startEdit(id) {
    currentEditingId = id;
    renderProducts();
}

function cancelEdit() {
    currentEditingId = null;
    renderProducts();
}

function saveEdit(id) {
    const name = document.getElementById(`editName-${id}`).value;
    const price = document.getElementById(`editPrice-${id}`).value;
    const image = document.getElementById(`editUrl-${id}`).value;

    const index = products.findIndex(p => p.id === id);
    if(index !== -1) {
        products[index] = { ...products[index], name, price: parseFloat(price), image };
        currentEditingId = null;
        renderProducts();
    }
}

// Silme Fonksiyonları
function openDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    deleteTargetId = null;
    document.getElementById('deleteModal').classList.remove('active');
}

function confirmDelete() {
    if(deleteTargetId) {
        products = products.filter(p => p.id !== deleteTargetId);
        closeDeleteModal();
        renderProducts();
    }
}

// Başlangıç İkonlarını Yükle
window.onload = () => {
    lucide.createIcons();
};
