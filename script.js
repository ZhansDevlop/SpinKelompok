<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembagi Kelompok Otomatis</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: #6C63FF;
            --secondary: #3F3D56;
            --accent: #FF6584;
            --bg: #f0f2f5;
            --white: #ffffff;
            --success: #00b894;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg);
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }

        h1 {
            color: var(--secondary);
            margin-bottom: 30px;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .app-container {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            justify-content: center;
            width: 100%;
            max-width: 1200px;
        }

        /* --- LEFT PANEL: CONTROLS --- */
        .panel {
            background: var(--white);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            flex: 1;
            min-width: 300px;
            max-width: 400px;
            height: fit-content;
        }

        .panel h2 {
            margin-top: 0;
            color: var(--primary);
            font-size: 1.2rem;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .form-group { margin-bottom: 15px; }
        
        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--secondary);
        }

        textarea {
            width: 100%;
            height: 120px;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            resize: none;
            font-family: 'Poppins', sans-serif;
            box-sizing: border-box;
            transition: 0.3s;
        }
        textarea:focus { border-color: var(--primary); outline: none; }

        input[type="number"] {
            width: 100%;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            box-sizing: border-box;
            font-family: inherit;
        }

        .btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            font-size: 1.1rem;
            transition: 0.3s;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .btn-generate {
            background: linear-gradient(135deg, var(--primary), #8e86ff);
            color: white;
            box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3);
            margin-top: 10px;
        }
        .btn-generate:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(108, 99, 255, 0.4); }
        
        .btn-generate:disabled { background: #ccc; cursor: not-allowed; transform: none; }

        .btn-reset { background: #e0e0e0; color: #555; }
        .btn-reset:hover { background: #d4d4d4; }

        /* --- MIDDLE PANEL: ANIMATION --- */
        .animation-panel {
            flex: 0 0 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 20px;
        }

        .loader-icon {
            font-size: 4rem;
            margin-bottom: 15px;
            display: none; /* Hidden by default */
        }

        .process-text {
            font-weight: bold;
            color: var(--secondary);
            display: none;
        }

        /* --- RIGHT PANEL: RESULTS --- */
        .results-container {
            flex: 1;
            min-width: 300px;
            background: var(--white);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-height: 600px;
            overflow-y: auto;
        }

        .group-box {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 5px solid var(--primary);
            animation: slideUp 0.5s ease-out forwards;
            opacity: 0;
        }

        .group-title {
            font-weight: 800;
            color: var(--secondary);
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .group-count-badge {
            background: var(--primary);
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 0.8rem;
        }

        .member-item {
            display: inline-block;
            background: white;
            padding: 5px 12px;
            border-radius: 20px;
            margin: 2px;
            font-size: 0.9rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            color: #333;
            border: 1px solid #eee;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
            .animation-panel { display: none; } /* Hide middle panel on mobile */
        }
    </style>
</head>
<body>

    <h1>🎲 Pembagi Kelompok Otomatis 🎲</h1>

    <div class="app-container">
        
        <!-- KOLOM INPUT -->
        <div class="panel">
            <h2>1. Masukkan Data</h2>
            <div class="form-group">
                <label>Nama Anggota (pisahkan dengan ENTER):</label>
                <textarea id="namesInput" placeholder="Budi&#10;Siti&#10;Joko&#10;Ani&#10;Bella" oninput="cekInput()"></textarea>
            </div>
            <div class="form-group">
                <label>Jumlah Kelompok:</label>
                <input type="number" id="groupCount" value="2" min="2" max="20">
            </div>
            
            <button class="btn btn-generate" id="generateBtn" onclick="acakDanBagi()">ACAK & BAGI KELOMPOK</button>
            <button class="btn btn-reset" onclick="resetHalaman()">Reset</button>

            <div style="margin-top: 20px; font-size: 0.85rem; color: #666; line-height: 1.5;">
                <p><strong>Cara Pakai:</strong></p>
                <ol>
                    <li>Masukkan daftar nama.</li>
                    <li>Tentukan jumlah kelompok.</li>
                    <li>Klik tombol <strong>ACAK & BAGI</strong>.</li>
                    <li>Selesai! Kelompok akan langsung muncul.</li>
                </ol>
            </div>
        </div>

        <!-- KOLOM ANIMASI (Middle) -->
        <div class="animation-panel">
            <div class="loader-icon" id="loaderIcon">🎲</div>
            <div class="process-text" id="processText">Mengacak...</div>
        </div>

        <!-- KOLOM HASIL -->
        <div class="results-container">
            <h2>2. Hasil Pengelompokan</h2>
            <div id="groupList" style="text-align: center; color: #aaa; margin-top: 50px;">
                <p>Belum ada hasil.</p>
            </div>
        </div>

    </div>

    <script>
        // Fungsi utama untuk mengacak dan membagi
        function acakDanBagi() {
            const input = document.getElementById('namesInput').value.trim();
            const groupCount = parseInt(document.getElementById('groupCount').value);
            const generateBtn = document.getElementById('generateBtn');
            
            // Validasi Input
            if (!input) {
                alert("Mohon masukkan nama anggota terlebih dahulu!");
                return;
            }

            // Pisahkan nama
            let allNames = input.split('\n').map(n => n.trim()).filter(n => n !== "");

            if (allNames.length < groupCount) {
                alert("Jumlah nama tidak boleh kurang dari jumlah kelompok!");
                return;
            }

            // UI Loading State
            generateBtn.disabled = true;
            generateBtn.innerText = "Memproses...";
            document.getElementById('groupList').innerHTML = ""; // Clear previous results
            
            // Tampilkan Animasi
            document.getElementById('loaderIcon').style.display = 'block';
            document.getElementById('loaderIcon').innerText = '🎲';
            document.getElementById('processText').style.display = 'block';

            // Delay 1 detik agar terlihat seperti sedang memproses
            setTimeout(() => {
                // Proses pengacakan
                let result = bagiKelompok(allNames, groupCount);
                
                // Tampilkan hasil
                renderHasil(result);
                
                // Reset Tombol
                generateBtn.disabled = false;
                generateBtn.innerText = "ACAK & BAGI KELOMPOK";
                
                // Sembunyikan animasi
                document.getElementById('loaderIcon').style.display = 'none';
                document.getElementById('processText').style.display = 'none';

            }, 800); // Durasi animasi 0.8 detik
        }

        // Logika membagi kelompok (Fisher-Yates Shuffle)
        function bagiKelompok(namaArray, jumlahGrup) {
            // 1. Acak array nama
            for (let i = namaArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [namaArray[i], namaArray[j]] = [namaArray[j], namaArray[i]];
            }

            // 2. Bagi ke dalam grup
            let grupObjek = {};
            for (let i = 0; i < jumlahGrup; i++) {
                grupObjek[i + 1] = [];
            }

            // Distribusikan nama ke grup
            namaArray.forEach((nama, index) => {
                let grupIndex = index % jumlahGrup;
                grupObjek[grupIndex + 1].push(nama);
            });

            return grupObjek;
        }

        // Menampilkan hasil ke HTML
        function renderHasil(grupObjek) {
            const container = document.getElementById('groupList');
            container.innerHTML = ""; // Pastikan bersih

            let html = "";

            for (const [namaGrup, anggota] of Object.entries(grupObjek)) {
                // Membuat daftar anggota HTML
                let daftarAnggota = anggota.map(nama => 
                    `<span class="member-item">${nama}</span>`
                ).join("");

                html += `
                    <div class="group-box" style="animation-delay: ${namaGrup * 0.1}s">
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
            // Ini bisa digunakan jika ingin otomatis tanpa klik tombol
            // Tapi untuk saat ini kita biarkan manual klik agar lebih jelas
        }
    </script>
</body>
</html>