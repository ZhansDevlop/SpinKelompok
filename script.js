// Fungsi utama untuk mengacak dan membagi
function acakDanBagi() {
    const input = document.getElementById('namesInput').value.trim();
    const groupCount = parseInt(document.getElementById('groupCount').value);
    const generateBtn = document.getElementById('generateBtn');
    
    // Validasi Input
    if (!input) {
        alert("📝 Mohon masukkan nama anggota terlebih dahulu!");
        return;
    }

    // Pisahkan nama
    let allNames = input.split('\n').map(n => n.trim()).filter(n => n !== "");

    if (allNames.length < groupCount) {
        alert("⚠️ Jumlah nama tidak boleh kurang dari jumlah kelompok!\nAnda memiliki " + allNames.length + " nama tapi membuat " + groupCount + " kelompok.");
        return;
    }

    // UI Loading State
    generateBtn.disabled = true;
    generateBtn.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Memproses...";
    
    // Scroll ke results container
    const resultsContainer = document.querySelector('.results-container');
    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    
    // Tampilkan Animasi Loading
    showLoadingState();
    
    // Buat floating dice
    createFloatingDice();

    // Delay 2-2.5 detik agar terlihat seperti sedang memproses
    setTimeout(() => {
        // Proses pengacakan
        let result = bagiKelompok(allNames, groupCount);
        
        // Tampilkan hasil dengan animasi staggered
        renderHasilWithAnimation(result, allNames.length);
        
        // Reset Tombol
        generateBtn.disabled = false;
        generateBtn.innerHTML = "<i class='fas fa-random'></i> ACAK & BAGI KELOMPOK";
        
        // Sembunyikan animasi loading
        hideLoadingState();

        // Tampilkan action buttons
        setTimeout(() => {
            document.getElementById('resultsActions').style.display = 'flex';
        }, 500);

    }, 2000);
}

// Tampilkan state loading dengan animasi yang lebih keren
function showLoadingState() {
    const resultsContainer = document.querySelector('.results-container');
    
    // Bersihkan hasil sebelumnya
    const groupList = document.getElementById('groupList');
    groupList.innerHTML = `
        <div class="loading-state">
            <div class="loading-content">
                <div class="dice-loader-big" id="diceLoaderBig">
                    <span class="dice-big dice-1">🎲</span>
                    <span class="dice-big dice-2">🎲</span>
                    <span class="dice-big dice-3">🎲</span>
                </div>
                <div class="loading-text">
                    <h3 id="loadingTextMain">Mengacak Nama...</h3>
                    <p id="loadingTextSub">Menghitung distribusi kelompok...</p>
                </div>
                <div class="progress-bar-big">
                    <div class="progress-fill-big"></div>
                </div>
            </div>
        </div>
    `;
    
    // Tambahkan class untuk animasi fade in
    groupList.classList.add('fade-in');
    
    // Animasi text cycling
    let textIndex = 0;
    const texts = [
        { main: 'Mengacak Nama...', sub: 'Menghitung distribusi kelompok...' },
        { main: 'Memproses Data...', sub: 'Menyiapkan hasil...' },
        { main: 'Hampir Selesai!', sub: 'Memverifikasi hasil...' }
    ];
    
    const textCycleInterval = setInterval(() => {
        textIndex = (textIndex + 1) % texts.length;
        const mainText = document.getElementById('loadingTextMain');
        const subText = document.getElementById('loadingTextSub');
        
        if (mainText && subText) {
            mainText.style.opacity = '0';
            subText.style.opacity = '0';
            
            setTimeout(() => {
                if (mainText && subText) {
                    mainText.textContent = texts[textIndex].main;
                    subText.textContent = texts[textIndex].sub;
                    mainText.style.opacity = '1';
                    subText.style.opacity = '1';
                }
            }, 300);
        }
    }, 800);
    
    // Simpan interval ID untuk dibersihkan nanti
    resultsContainer.dataset.textCycleInterval = textCycleInterval;
}

// Sembunyikan state loading
function hideLoadingState() {
    const resultsContainer = document.querySelector('.results-container');
    
    // Hapus interval jika ada
    if (resultsContainer.dataset.textCycleInterval) {
        clearInterval(parseInt(resultsContainer.dataset.textCycleInterval));
        delete resultsContainer.dataset.textCycleInterval;
    }
    
    // Fade out loading
    const groupList = document.getElementById('groupList');
    groupList.classList.remove('fade-in');
}

// Logika membagi kelompok (Fisher-Yates Shuffle)
function bagiKelompok(namaArray, jumlahGrup) {
    // 1. Deep copy array
    let shuffled = [...namaArray];
    
    // 2. Acak array nama menggunakan Fisher-Yates
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 3. Bagi ke dalam grup
    let grupObjek = {};
    for (let i = 0; i < jumlahGrup; i++) {
        grupObjek[i + 1] = [];
    }

    // Distribusikan nama ke grup
    shuffled.forEach((nama, index) => {
        let grupIndex = index % jumlahGrup;
        grupObjek[grupIndex + 1].push(nama);
    });

    return grupObjek;
}

// Menampilkan hasil ke HTML dengan animasi staggered yang smooth
function renderHasilWithAnimation(grupObjek, totalNames) {
    const container = document.getElementById('groupList');
    container.innerHTML = "";
    container.classList.remove('fade-in');

    let html = "";
    const colors = ['#6C63FF', '#FF6584', '#17A2B8', '#FFC107', '#00b894'];

    let index = 0;
    for (const [namaGrup, anggota] of Object.entries(grupObjek)) {
        const color = colors[index % colors.length];
        
        // Membuat daftar anggota HTML
        let daftarAnggota = anggota.map((nama, idx) => 
            `<span class="member-item" style="animation-delay: ${index * 0.15 + idx * 0.05}s;">👤 ${nama}</span>`
        ).join("");

        html += `
            <div class="group-box" style="animation-delay: ${index * 0.15}s">
                <div class="group-title">
                    <span><i class="fas fa-users" style="color: ${color}; margin-right: 8px;"></i>Kelompok ${namaGrup}</span>
                    <span class="group-count-badge" style="background: linear-gradient(135deg, ${color}, ${shadeColor(color, 20)});">${anggota.length} Anggota</span>
                </div>
                <div class="members-list">${daftarAnggota}</div>
            </div>
        `;
        index++;
    }

    container.innerHTML = html;
    
    // Trigger animation dengan fade in
    container.classList.add('fade-in');
    
    // Update stats
    updateStats(Object.keys(grupObjek).length, totalNames);
}

// Menampilkan hasil ke HTML dengan desain colorful (backup function)
function renderHasil(grupObjek, totalNames) {
    renderHasilWithAnimation(grupObjek, totalNames);
}

// Utility function untuk shade color
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);
    
    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);
    
    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;
    
    return "#" + "0" + R.toString(16) + "0" + G.toString(16) + "0" + B.toString(16);
}

// Fungsi Reset Halaman
function resetHalaman() {
    location.reload();
}

// Cek input realtime dan update counter
function cekInput() {
    const input = document.getElementById('namesInput').value.trim();
    const names = input.split('\n').filter(n => n.trim() !== "");
    document.getElementById('nameCount').textContent = names.length + ' nama';
    document.getElementById('totalNames').textContent = names.length;
}

// Update stats
function updateStats(groupCount, totalNames) {
    document.getElementById('totalNames').textContent = totalNames;
    document.getElementById('totalGroups').textContent = groupCount;
}

// Kontrol jumlah kelompok
function decreaseGroups() {
    const input = document.getElementById('groupCount');
    if (parseInt(input.value) > 2) {
        input.value = parseInt(input.value) - 1;
        document.getElementById('totalGroups').textContent = input.value;
    }
}

function increaseGroups() {
    const input = document.getElementById('groupCount');
    if (parseInt(input.value) < 20) {
        input.value = parseInt(input.value) + 1;
        document.getElementById('totalGroups').textContent = input.value;
    }
}

// Update kelompok saat input berubah
document.addEventListener('DOMContentLoaded', function() {
    const groupInput = document.getElementById('groupCount');
    groupInput.addEventListener('change', function() {
        document.getElementById('totalGroups').textContent = this.value;
    });

    // Initial count
    cekInput();
});

// Floating Dice Function
function createFloatingDice() {
    const container = document.getElementById('floatingDice');
    container.innerHTML = '';
    
    const dice = ['🎲', '🎪', '🎯', '✨'];
    for (let i = 0; i < 3; i++) {
        const item = document.createElement('span');
        item.className = 'floating-dice-item';
        item.textContent = dice[Math.floor(Math.random() * dice.length)];
        item.style.left = Math.random() * 100 + 'px';
        item.style.animationDelay = (i * 0.3) + 's';
        container.appendChild(item);
    }
}

// Copy hasil ke clipboard
function copyResults() {
    const groupList = document.getElementById('groupList');
    let text = 'HASIL PENGELOMPOKAN\n\n';
    
    const groups = groupList.querySelectorAll('.group-box');
    groups.forEach(group => {
        const title = group.querySelector('.group-title span').textContent;
        const members = Array.from(group.querySelectorAll('.member-item'))
            .map(item => item.textContent.replace('👤 ', ''))
            .join(', ');
        text += `${title}\n${members}\n\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Hasil pengelompokan berhasil disalin!');
    }).catch(() => {
        alert('❌ Gagal menyalin hasil');
    });
}

// Print hasil
function printResults() {
    const printWindow = window.open('', '', 'height=600,width=800');
    const groupList = document.getElementById('groupList').innerHTML;
    
    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hasil Pengelompokan - Spin Kelompok</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #6C63FF; text-align: center; }
                .group-box { margin-bottom: 20px; padding: 15px; border-left: 5px solid #6C63FF; background: #f9f9f9; }
                .group-title { font-weight: bold; margin-bottom: 10px; }
                .member-item { display: inline-block; background: white; padding: 5px 10px; margin: 3px; border-radius: 15px; }
            </style>
        </head>
        <body>
            <h1>🎲 Hasil Pengelompokan - Spin Kelompok</h1>
            <p style="text-align: center; color: #999;">Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
            <hr>
            ${groupList}
        </body>
        </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Enter key to generate
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        acakDanBagi();
    }
})
