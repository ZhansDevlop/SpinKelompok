// Fungsi utama untuk mengacak dan membagi
function acakDanBagi() {
    const input = document.getElementById('namesInput').value.trim();
    const groupCount = parseInt(document.getElementById('groupCount').value, 10);
    const generateBtn = document.getElementById('generateBtn');

    // Validasi Input
    if (!input) {
        alert("Mohon masukkan nama anggota terlebih dahulu!");
        return;
    }

    // Pisahkan nama
    const allNames = input
        .split('\n')
        .map((n) => n.trim())
        .filter((n) => n !== "");

    if (Number.isNaN(groupCount) || groupCount < 2) {
        alert("Jumlah kelompok minimal 2!");
        return;
    }

    if (allNames.length < groupCount) {
        alert("Jumlah nama tidak boleh kurang dari jumlah kelompok!");
        return;
    }

    // UI Loading State (hasil baru akan muncul setelah proses selesai)
    generateBtn.disabled = true;
    generateBtn.innerText = "Memproses...";

    // Sembunyikan hasil sebelumnya
    const container = document.getElementById('groupList');
    container.innerHTML = "";

    // Tampilkan animasi
    const loaderIcon = document.getElementById('loaderIcon');
    const processText = document.getElementById('processText');

    loaderIcon.style.display = 'block';
    loaderIcon.innerText = '';
    processText.style.display = 'block';

    // Delay agar terasa "sedang diacak"
    setTimeout(() => {
        // Proses pengacakan
        const result = bagiKelompok([...allNames], groupCount);

        // Tampilkan hasil (ini yang muncul setelah tombol diklik)
        renderHasil(result);

        // Reset Tombol
        generateBtn.disabled = false;
        generateBtn.innerText = "ACAK & BAGI KELOMPOK";

        // Sembunyikan animasi
        loaderIcon.style.display = 'none';
        processText.style.display = 'none';
    }, 800);
}

// Logika membagi kelompok (Fisher-Yates Shuffle)
function bagiKelompok(namaArray, jumlahGrup) {
    // 1) Acak array nama
    for (let i = namaArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [namaArray[i], namaArray[j]] = [namaArray[j], namaArray[i]];
    }

    // 2) Bagi ke dalam grup
    const grupObjek = {};
    for (let i = 0; i < jumlahGrup; i++) {
        grupObjek[i + 1] = [];
    }

    namaArray.forEach((nama, index) => {
        const grupIndex = index % jumlahGrup;
        grupObjek[grupIndex + 1].push(nama);
    });

    return grupObjek;
}

// Menampilkan hasil ke HTML
function renderHasil(grupObjek) {
    const container = document.getElementById('groupList');

    let html = "";
    for (const [namaGrup, anggota] of Object.entries(grupObjek)) {
        const daftarAnggota = anggota
            .map((nama) => `<span class="member-item">${nama}</span>`)
            .join("");

        html += `
            <div class="group-box" style="animation-delay: ${Number(namaGrup) * 0.1}s">
                <div class="group-title">
                    <span>Kelompok ${namaGrup}</span>
                    <span class="group-count-badge">${anggota.length} Org</span>
                </div>
                <div class="members-list">${daftarAnggota}</div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Fungsi Reset Halaman
function resetHalaman() {
    location.reload();
}

// Fitur tambahan: Cek input realtime (Opsional)
function cekInput() {
    // sengaja kosong (disediakan untuk hook oninput)
}

function toggleTheme() {
    const body = document.body;
    const button = document.getElementById('themeToggle');
    body.classList.toggle('dark-mode');
    button.innerText = body.classList.contains('dark-mode') ? 'Mode Terang' : 'Mode Gelap';
