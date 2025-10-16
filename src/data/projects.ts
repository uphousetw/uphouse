export type ProjectStatus = "�w��" | "�I�u��" | "�w���u"

export interface Project {
  id?: string
  slug: string
  name: string
  headline: string
  location: string
  status: ProjectStatus
  areaRange: string
  unitType: string
  priceRange: string
  description: string
  highlights: string[]
  heroImage: string
  gallery: string[]
  contactPhone: string
  address: string
  launchDate: string
  isFeatured: boolean
  heroImageDeleteToken?: string | null
  galleryDeleteTokens?: string[]
}

export interface ProjectRow {
  id: string
  slug: string
  name: string
  headline: string | null
  location: string | null
  status: ProjectStatus
  area_range: string | null
  unit_type: string | null
  price_range: string | null
  description: string | null
  highlights: string[] | null
  hero_image: string | null
  gallery: string[] | null
  contact_phone: string | null
  address: string | null
  launch_date: string | null
  is_featured: boolean | null
  hero_image_delete_token: string | null
  gallery_delete_tokens: string[] | null
  created_at: string
}

const fallbackText = '��T�ݧ�s'

export const mapProject = (row: ProjectRow): Project => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  headline: row.headline ?? fallbackText,
  location: row.location ?? fallbackText,
  status: row.status,
  areaRange: row.area_range ?? fallbackText,
  unitType: row.unit_type ?? fallbackText,
  priceRange: row.price_range ?? fallbackText,
  description: row.description ?? fallbackText,
  highlights: row.highlights ?? [],
  heroImage: row.hero_image ?? '',
  gallery: row.gallery ?? [],
  contactPhone: row.contact_phone ?? fallbackText,
  address: row.address ?? fallbackText,
  launchDate: row.launch_date ?? fallbackText,
  isFeatured: row.is_featured ?? false,
  heroImageDeleteToken: row.hero_image_delete_token,
  galleryDeleteTokens: row.gallery_delete_tokens ?? [],
})

export const sampleProjects: Project[] = [
  {
    slug: 'emerald-lane',
    name: '�Z�A�j�D',
    headline: '�H�q�n�b 28 �h������_�v',
    location: '�x�_���H�q�ϧd���� 88 ��',
    status: '�w��',
    areaRange: '32-58 �W',
    unitType: '2-4 ��',
    priceRange: '�C�W 120 - 150 �U',
    description:
      '�Z�A�j�D�H����ؿv���֤ߡA�ĥ� Low-E �����P�`��~�߳]�p�A���X 28 �Ӵ��[�|�һP�Ť����A���y�H�q�n�b�s�a�СC',
    highlights: [
      '�T���ĥ� + 270�X ����',
      '�q�j�Q SCIC �Ȼs�p��',
      'B1-B3 ���V�������D',
      '���� AI ���z�w���t��',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1529429617124-aee747d3a7e2?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1080&q=80',
    ],
    contactPhone: '(02) 2345-8765',
    address: '�x�_���H�q�ϫH�q�����q 150 ��',
    launchDate: '2025 Q2',
    isFeatured: true,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
  {
    slug: 'forest-harbor',
    name: '�˶״��W',
    headline: '�L�f A7 ���� 68% ���вv�@�P����',
    location: '�s�_���L�f�Ϥ�Ƥ@���T�q',
    status: '�I�u��',
    areaRange: '28-46 �W',
    unitType: '2-3 ��',
    priceRange: '�C�W 52 - 68 �U',
    description:
      '�˶״��W�H�˪L�t���[���x���p���@�]�I�A�ɤJ�^�� BREEAM ����{���U�ݡA���y�C�Ҹ`��B�@�ɦ@�P�����ϥͬ��C',
    highlights: [
      '740 �W�ˬ����x',
      '24 �p�� AI ���T����',
      'Sky Lounge ���h�D��',
      '�B�� 6 ������F���� A7',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1467803738586-46b7eb7b16cf?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1080&q=80',
    ],
    contactPhone: '(02) 2987-1122',
    address: '�s�_���L�f�Ϥ��R�� 88 ��',
    launchDate: '2024 Q4',
    isFeatured: true,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
  {
    slug: 'harborline',
    name: '�����',
    headline: '�H���s�����خ��ͬ���_�a��',
    location: '�s�_���H�����خ����G�q',
    status: '�w���u',
    areaRange: '35-72 �W',
    unitType: '3-5 ��',
    priceRange: '�C�W 45 - 55 �U',
    description:
      '����ɥH�����Ĥ@�Ƶ����P 360�X �����������y�_�����̨���ѫת��ؿv�q��A���X�������޲z�P���W���_���c�C',
    highlights: [
      '���K�Ũ�_����',
      '�T�N�P��ƦX���槽',
      '�@�h������q��',
      '���P�Ŷ������޲z',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1496302662116-35cc4f36df92?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1494527492857-66e29fb2926e?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=1080&q=80',
    ],
    contactPhone: '(02) 2626-5566',
    address: '�s�_���H���Ϥ����F���@�q 26 ��',
    launchDate: '2023 Q3',
    isFeatured: false,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
]

export const sampleFeaturedProjects = sampleProjects.filter((project) => project.isFeatured).slice(0, 2)
