// ==========================================
// 1. CORE SYSTEM & ROUTING
// ==========================================
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('hide'), 600));
document.addEventListener('DOMContentLoaded', () => { lucide.createIcons(); updateNavbarState(); loadHomeStats(); });

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  setTimeout(() => {
    document.getElementById('page-' + page)?.classList.add('active');
    lucide.createIcons();
    if(page === 'profile') loadProfilePage();
    if(page === 'dashboard') loadDashboardPage();
    if(page === 'admin') loadAdminPage();
  }, 50);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleDark() { document.documentElement.classList.toggle('dark'); }
function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('open'); document.getElementById('mobileOverlay').classList.toggle('hidden'); }
function showToast(msg) { const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3000); }

function loadHomeStats() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = el.getAttribute('data-targetdb');
    if(target === 'siswa') el.textContent = DB.siswa.length;
    if(target === 'guru') el.textContent = DB.guru.length;
  });
  const s = DB.sekolah[0];
  document.getElementById('homeAkreditasi').textContent = s.akreditasi;
  document.getElementById('homeVisi').textContent = s.visi;
  document.getElementById('footNama').textContent = s.nama;
  document.getElementById('footAlamat').textContent = s.alamat;
  document.getElementById('footTelp').textContent = s.telepon;
  document.getElementById('footEmail').textContent = s.email;
}

function updateNavbarState() {
  const btnLogin = document.getElementById('navLoginBtn');
  const userMenu = document.getElementById('navUserMenu');
  if(currentUser) {
    btnLogin.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userMenu.classList.add('flex');
    document.getElementById('navAvatar').src = `https://picsum.photos/seed/${currentUser.username}/80/80.jpg`;
    document.getElementById('navUsername').textContent = currentUser.username;
  } else {
    btnLogin.classList.remove('hidden');
    userMenu.classList.add('hidden');
    userMenu.classList.remove('flex');
  }
}

// ==========================================
// 2. AUTHENTICATION (Login/Logout)
// ==========================================
function performLogin() {
  const u = document.getElementById('loginUser').value;
  const p = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  const user = DB.users.find(x => x.username === u && x.password === p);
  
  if(user) {
    currentUser = user;
    currentUser.role = DB.roles.find(r => r.id === user.role_id).name;
    if(currentUser.role === 'Siswa') currentUser.data = DB.siswa.find(s => s.id === user.ref_id);
    else if(currentUser.role === 'Guru') currentUser.data = DB.guru.find(g => g.id === user.ref_id);
    errEl.classList.add('hidden');
    updateNavbarState();
    showToast(`Login berhasil sebagai ${currentUser.role}!`);
    if(currentUser.role === 'Admin') navigate('admin');
    else navigate('dashboard');
  } else { errEl.classList.remove('hidden'); }
}

function logout() {
  currentUser = null;
  updateNavbarState();
  navigate('home');
  showToast('Anda telah keluar.');
}

// ==========================================
// 3. PPDB SYSTEM (Insert Data)
// ==========================================
function goStep(n) {
  document.getElementById('ppdbStep1').classList.toggle('hidden', n !== 1);
  document.getElementById('ppdbStep2').classList.toggle('hidden', n !== 2);
  document.getElementById('stepFill').style.width = n === 2 ? '100%' : '0%';
  const d1 = document.getElementById('step1dot').querySelector('div');
  const d2 = document.getElementById('step2dot').querySelector('div');
  d1.className = `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${n>=1?'bg-school-light text-white':'bg-slate-300 text-slate-500'}`;
  d2.className = `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${n>=2?'bg-school-light text-white':'bg-slate-300 text-slate-500'}`;
}

function submitPPDB() {
  const nama = document.getElementById('ppdbNama').value;
  const asal = document.getElementById('ppdbAsal').value;
  const jalur = document.getElementById('ppdbJalur').value;
  if(!nama || !asal) return showToast('Harap isi semua data!');
  
  const newId = DB.ppdb.length > 0 ? Math.max(...DB.ppdb.map(p => p.id)) + 1 : 1;
  const kode = `PPDB-2025-${String(847 + newId).padStart(5, '0')}`;
  const newPendaftar = { id: newId, nomor_daftar: kode, nama_lengkap: nama, asal_sekolah: asal, jalur_masuk: jalur, status: 'Review' };
  DB.ppdb.push(newPendaftar);
  localStorage.setItem('db_ppdb', JSON.stringify(DB.ppdb));
  
  document.getElementById('ppdbKode').textContent = kode;
  goStep(2);
  showToast('Pendaftaran berhasil disimpan ke DB!');
}

// ==========================================
// 4. DYNAMIC PAGE LOADERS (Read Data)
// ==========================================
function loadProfilePage() {
  const s = DB.sekolah[0];
  document.getElementById('profileContent').innerHTML = `
    <div class="grid grid-cols-3 gap-4"><div class="font-medium text-slate-500">Nama</div><div class="col-span-2 font-semibold">${s.nama}</div></div>
    <div class="grid grid-cols-3 gap-4"><div class="font-medium text-slate-500">Kepala Sekolah</div><div class="col-span-2">${s.kepala_sekolah}</div></div>
    <div class="grid grid-cols-3 gap-4"><div class="font-medium text-slate-500">Akreditasi</div><div class="col-span-2 font-bold text-gold-500 text-xl">${s.akreditasi}</div></div>
  `;
}

function loadDashboardPage() {
  if(!currentUser) return navigate('login');
  const d = currentUser.data;
  document.getElementById('dashName').textContent = `Halo, ${d.nama_lengkap}!`;
  document.getElementById('dashAvatar').src = `https://picsum.photos/seed/${currentUser.username}/100/100.jpg`;
  const el = document.getElementById('dashProfile');
  if(currentUser.role === 'Siswa') {
    document.getElementById('dashClass').textContent = `${d.kelas} — NIS: ${d.nis}`;
    el.innerHTML = `<div class="grid grid-cols-3 gap-4"><div class="text-slate-500">NISN</div><div class="col-span-2 font-semibold">${d.nisn}</div></div><div class="grid grid-cols-3 gap-4"><div class="text-slate-500">Jurusan</div><div class="col-span-2">${d.jurusan}</div></div>`;
  } else if(currentUser.role === 'Guru') {
    document.getElementById('dashClass').textContent = `${d.jabatan} — NIP: ${d.nip}`;
    el.innerHTML = `<div class="grid grid-cols-3 gap-4"><div class="text-slate-500">Mapel</div><div class="col-span-2 font-semibold">${d.mapel}</div></div>`;
  }
}

function loadAdminPage() {
  if(!currentUser || currentUser.role !== 'Admin') return navigate('login');
  document.getElementById('admTotalSiswa').textContent = DB.siswa.length;
  document.getElementById('admTotalGuru').textContent = DB.guru.length;
  document.getElementById('admTotalPPDB').textContent = DB.ppdb.length;
  document.getElementById('admAkreditasi').textContent = DB.sekolah[0].akreditasi;
  
  document.getElementById('admSiswaTable').innerHTML = DB.siswa.map(s => `<tr class="border-b dark:border-slate-700/50"><td class="py-2">${s.nis}</td><td class="py-2 font-medium">${s.nama_lengkap}</td><td class="py-2">${s.kelas}</td></tr>`).join('');
  document.getElementById('admPPDBTable').innerHTML = DB.ppdb.slice().reverse().map(p => {
    const sc = p.status === 'Verifikasi' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30';
    return `<tr class="border-b dark:border-slate-700/50"><td class="py-2 font-mono text-xs">${p.nomor_daftar}</td><td class="py-2 font-medium">${p.nama_lengkap}</td><td class="py-2"><span class="px-2 py-1 text-xs rounded-lg font-medium ${sc}">${p.status}</span></td></tr>`;
  }).join('');
}