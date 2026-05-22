const DB = {
  roles: [ { id: 1, name: 'Admin' }, { id: 2, name: 'Siswa' }, { id: 3, name: 'Guru' } ],
  sekolah: [ 
    { id: 1, nama: 'SMA Negeri 1 Nusantara', npsn: '12345678', alamat: 'Jl. Pendidikan No. 1, Kota Nusantara', telepon: '(021) 1234-5678', email: 'info@sman1nusantara.sch.id', kepala_sekolah: 'Drs. Ahmad Suryadi, M.Pd.', akreditasi: 'A', visi: 'Terwujudnya sekolah unggul berdaya saing global', misi: 'Melaksanakan pembelajaran aktif dan inovatif' } 
  ],
  users: [ 
    { id: 1, role_id: 1, username: 'admin', password: 'admin123', ref_id: 0 }, 
    { id: 2, role_id: 2, username: 'aisyah', password: 'siswa123', ref_id: 1 }, 
    { id: 3, role_id: 3, username: 'ahmad', password: 'guru123', ref_id: 1 }, 
    { id: 4, role_id: 2, username: 'faisal', password: 'siswa123', ref_id: 2 } 
  ],
  siswa: [ 
    { id: 1, nis: '2023010001', nisn: '0012345001', nama_lengkap: 'Aisyah Putri', jenis_kelamin: 'P', kelas: 'XI MIPA 1', jurusan: 'MIPA', alamat: 'Jl. Mawar No. 10' }, 
    { id: 2, nis: '2023010002', nisn: '0012345002', nama_lengkap: 'Muhammad Faisal', jenis_kelamin: 'L', kelas: 'XI MIPA 1', jurusan: 'MIPA', alamat: 'Jl. Melati No. 5' }, 
    { id: 3, nis: '2023010003', nisn: '0012345003', nama_lengkap: 'Rina Wati', jenis_kelamin: 'P', kelas: 'XII IPS 2', jurusan: 'IPS', alamat: 'Jl. Anggrek No. 8' } 
  ],
  guru: [ 
    { id: 1, nip: '198001011', nama_lengkap: 'Drs. Ahmad Suryadi, M.Pd.', jenis_kelamin: 'L', mapel: 'Manajemen', jabatan: 'Kepala Sekolah' }, 
    { id: 2, nip: '198502022', nama_lengkap: 'Dr. Siti Nurhaliza, M.Si.', jenis_kelamin: 'P', mapel: 'Biologi', jabatan: 'Wakil Kurikulum' } 
  ],
  ppdb: [ 
    { id: 1, nomor_daftar: 'PPDB-2025-00847', nama_lengkap: 'Rina Wati', asal_sekolah: 'SMPN 3 Nusantara', jalur_masuk: 'Zonasi', status: 'Verifikasi' }, 
    { id: 2, nomor_daftar: 'PPDB-2025-00846', nama_lengkap: 'Ahmad Rizky', asal_sekolah: 'SMPN 1 Nusantara', jalur_masuk: 'Prestasi', status: 'Review' } 
  ]
};

// Load PPDB from localStorage if exists (persistence simulation)
if(localStorage.getItem('db_ppdb')) { 
  DB.ppdb = JSON.parse(localStorage.getItem('db_ppdb')); 
}

let currentUser = null; // Logged in user object