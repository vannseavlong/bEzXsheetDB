export const mockCategories: CategoryAttributes[] = [
  {
    id: 1,
    iconUrl: 'https://placehold.co/64x64?text=Clean',
    nameEn: 'Home Cleaning',
    sort: 1,
    status: true,
    updatedAt: '2026-04-01T00:00:00.000Z',
    products: [
      { id: '1', nameEn: 'Standard Cleaning' },
      { id: '2', nameEn: 'Deep Cleaning' }
    ]
  },
  {
    id: 2,
    iconUrl: 'https://placehold.co/64x64?text=Pest',
    nameEn: 'Pest Control',
    sort: 2,
    status: true,
    updatedAt: '2026-04-05T00:00:00.000Z',
    products: [
      { id: '3', nameEn: 'Cockroach Control' },
      { id: '4', nameEn: 'Mosquito Control' }
    ]
  },
  {
    id: 3,
    iconUrl: 'https://placehold.co/64x64?text=AC',
    nameEn: 'AC Cleaning',
    sort: 3,
    status: false,
    updatedAt: '2026-04-10T00:00:00.000Z',
    products: []
  }
];

export const mockCategoryDetail: CategoryDetailProps = {
  id: 1,
  nameEn: 'Home Cleaning',
  nameKm: 'សំអាតផ្ទះ',
  nameVi: 'Dọn dẹp nhà cửa',
  nameCn: '家庭清洁',
  nameTw: '家庭清潔',
  iconUrl: 'https://placehold.co/64x64?text=Clean',
  status: true,
  sort: 1,
  isComingSoon: false,
  isRecommended: true,
  hasQty: false,
  noteEn: null,
  noteKm: null,
  noteVi: null,
  noteCn: null,
  noteTw: null,
  taskInfoEn: [{ key: 'What to prepare', value: ['Clear the area', 'Remove fragile items'] }],
  taskInfoKm: [],
  taskInfoVi: [],
  taskInfoCn: [],
  taskInfoTw: [],
  products: [
    {
      id: 1,
      nameEn: 'Standard Cleaning',
      nameKm: null,
      nameVi: null,
      nameCn: null,
      nameTw: null,
      iconUrl: null,
      amount: 25,
      status: true,
      sort: 1
    }
  ],
  productAddOnGroups: [],
  productEquipments: []
};
