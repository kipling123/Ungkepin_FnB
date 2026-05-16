/** Dua menu sesuai mockup + foto /public/images */
export const foodProducts = [
  {
    id: 'ayam',
    name: 'Paket Ayam Bumbu Kuning',
    shortLabel: 'Ayam',
    category: 'Ayam',
    price: 'Rp 20.000',
    priceNumeric: 20000,
    image: '/images/ayam-bumbu-kuning.png',
    description: 'Ayam goreng bumbu kuning dengan rempah khas Indonesia.',
    summaryNote: 'Level 3, Nasi Putih, Es Teh Manis',
    status: 'STATUS PO',
    sold: 15,
    quota: 50,
    isFeatured: true,
  },
  {
    id: 'lele',
    name: 'Pecel Lele Bumbu Kuning',
    shortLabel: 'Lele',
    category: 'Ikan',
    price: 'Rp 22.000',
    priceNumeric: 22000,
    image: '/images/lele-bumbu-kuning.png',
    description: 'Pecel lele dengan bumbu khas Indonesia pilihan keluarga.',
    summaryNote: 'Bumbu kuning, lalapan, sambal',
    status: 'STATUS PO',
    sold: 8,
    quota: 50,
    isFeatured: false,
  },
];

export const categories = [
  { id: 'all', label: 'Semua' },
  { id: 'Ayam', label: 'Ayam' },
  { id: 'Ikan', label: 'Ikan' },
];
