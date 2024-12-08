export const AdminMenus = [
  {
    title: "Dashboard",
    icon: { icon: "ri-home-smile-line" },
    to: "index",
  },
  {
    title: "Anggota",
    icon: { icon: "ri-user-line" },
    children: [
      {
        title: "Daftar Anggota",
        icon: { icon: "ri-file-list-line" },
        to: "anggota-data",
      },
      {
        title: "Kartu Anggota",
        icon: { icon: "ri-id-card-line" },
        to: "anggota-kartu",
      },
    ],
  },
  {
    title: "Simpanan",
    icon: { icon: "ri-inbox-archive-fill" },
    children: [
      {
        title: "Data Simpanan Reguler",
        icon: { icon: "ri-archive-line" },
        to: "simpanan-data",
      },
      {
        title: "Data Simpanan Berjangka",
        icon: { icon: "ri-archive-line" },
        to: "simpanan-data",
      },
      {
        title: "Jenis Simpanan",
        icon: { icon: "ri-archive-drawer-line" },
        to: "simpanan-jenis",
      },
      {
        title: "Penarikan Simpanan",
        icon: { icon: "ri-wallet-2-line" },
        to: "simpanan-penarikan",
      },
    ],
  },
  {
    title: "Pinjaman",
    icon: { icon: "ri-inbox-unarchive-fill" },
    children: [
      {
        title: "Data Pinjaman",
        icon: { icon: "ri-archive-line" },
        to: "pinjaman-data",
      },
      {
        title: "Jenis Pinjaman",
        icon: { icon: "ri-archive-drawer-line" },
        to: "pinjaman-jenis",
      },
      {
        title: "Pembayaran",
        icon: { icon: "ri-wallet-2-line" },
        to: "pinjaman-pembayaran",
      },
    ],
  },
  {
    title: "Keuangan",
    icon: { icon: "ri-refund-2-line" },
    children: [
      {
        title: "Pemasukan",
        icon: { icon: "ri-inbox-archive-fill" },
        to: "keuangan-pemasukan",
      },
      {
        title: "Pengeluaran",
        icon: { icon: "ri-inbox-unarchive-fill" },
        to: "keuangan-pengeluaran",
      },
      {
        title: "Saldo",
        icon: { icon: "ri-exchange-dollar-line" },
        to: "keuangan-saldo",
      },
    ],
  },
  {
    title: "Konfigurasi",
    icon: { icon: "ri-list-settings-line" },
    children: [
      {
        title: "Pengaturan Aplikasi",
        icon: { icon: "ri-terminal-window-line" },
        to: "konfigurasi-aplikasi",
      },
      {
        title: "Zona Cabang",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-zona-cabang",
      },
      {
        title: "Cabang",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-cabang",
      },
      {
        title: "Departemen",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-departemen",
      },
      {
        title: "Jenis Marketing",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-jenis-marketing",
      },
      {
        title: "Marketing",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-marketing",
      },
      {
        title: "Bank Mitra",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-bank-mitra",
      },
      {
        title: "Cabang Bank Mitra",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-bank-mitra-cabang",
      },
      {
        title: "Parameter Bank Mitra",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-bank-mitra-parameter",
      },
      {
        title: "Produk Simpanan",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-produk-simpanan",
      },
      {
        title: "Produk Simpanan Berjangka",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-produk-simpanan-berjangka",
      },
      {
        title: "Produk Pinjaman",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-produk-pinjaman",
      },
      {
        title: "Deviasi",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-deviasi",
      },
      {
        title: "Kolektibilitas",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-kolektibilitas",
      },
      {
        title: "Suku Bunga",
        icon: { icon: "ri-map-pin-line" },
        to: "konfigurasi-suku-bunga",
      },
      {
        title: "Level",
        icon: { icon: "ri-color-filter-fill" },
        to: "konfigurasi-level",
      },
      {
        title: "Pengguna",
        icon: { icon: "ri-user-smile-line" },
        to: "konfigurasi-user",
      },
    ],
  },
];

export const ParticipantMenus = [
  {
    title: "Dashboard",
    icon: { icon: "ri-home-smile-line" },
    to: "index",
  },
  {
    title: "Simpanan",
    icon: { icon: "ri-inbox-archive-fill" },
    to: "member-simpanan",
  },
  {
    title: "Penarikan Simpanan",
    icon: { icon: "ri-exchange-dollar-line" },
    to: "member-penarikan-simpanan",
  },
  {
    title: "Pinjaman",
    icon: { icon: "ri-inbox-unarchive-fill" },
    to: "member-pinjaman",
  },
  {
    title: "Pembayaran Pinjaman",
    icon: { icon: "ri-wallet-2-line" },
    to: "member-pembayaran-pinjaman",
  },
];
