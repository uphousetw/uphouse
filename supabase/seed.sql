-- ============================================================
-- SEED DATA: Default/Sample Content for All Tables
-- ============================================================
-- This file contains all seed/sample data for the database.
-- Run this AFTER running schema.sql to populate initial content.
-- Safe to re-run: uses "on conflict" clauses to handle duplicates.
--
-- Usage:
--   1. Development: Run this to get sample data for testing
--   2. Production: Skip this and add real content via admin panel
-- ============================================================

-- ============================================================
-- PROJECTS: Sample Project Data
-- ============================================================

insert into public.projects (
  slug,
  name,
  headline,
  location,
  status,
  area_range,
  unit_type,
  price_range,
  description,
  highlights,
  hero_image,
  gallery,
  contact_phone,
  address,
  launch_date,
  is_featured
)
values
  (
    'emerald-lane',
    '琢翠大道',
    '信義南軸 28 層環景制震宅',
    '台北市信義區吳興街 88 號',
    '預售',
    '32-58 坪',
    '2-4 房',
    '每坪 120 - 150 萬',
    '琢翠大道以永續建築為核心，採用 Low-E 玻璃與節能外殼設計，結合 28 樓景觀會所與空中花園，打造信義南軸新地標。',
    array[
      '三面採光 + 270° 市景',
      '義大利 SCIC 客製廚具',
      'B1-B3 雙向平面車道',
      '全棟 AI 智慧安防系統'
    ],
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
    array[
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1529429617124-aee747d3a7e2?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1080&q=80'
    ],
    '(02) 2345-8765',
    '台北市信義區信義路五段 150 號',
    '2025 Q2',
    true
  ),
  (
    'forest-harbor',
    '森匯港灣',
    '林口 A7 中心 68% 綠覆率共感社區',
    '新北市林口區文化一路三段',
    '施工中',
    '28-46 坪',
    '2-3 房',
    '每坪 52 - 68 萬',
    '森匯港灣以森林系景觀中庭串聯公共設施，導入英國 BREEAM 永續認證顧問，打造低碳節能、共享共感的社區生活。',
    array[
      '740 坪森活中庭',
      '24 小時 AI 門禁巡檢',
      'Sky Lounge 雙層挑高',
      '步行 6 分鐘抵達機捷 A7'
    ],
    'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1600&q=80',
    array[
      'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1467803738586-46b7eb7b16cf?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1080&q=80'
    ],
    '(02) 2987-1122',
    '新北市林口區仁愛路 88 號',
    '2024 Q4',
    true
  ),
  (
    'harborline',
    '澄海界',
    '淡海新市鎮濱海生活制震地標',
    '新北市淡水區濱海路二段',
    '已完工',
    '35-72 坪',
    '3-5 房',
    '每坪 45 - 55 萬',
    '澄海界以海景第一排視野與 360° 環景玻璃打造北海岸最具辨識度的建築量體，結合飯店式管理與高規格制震結構。',
    array[
      '高鐵級制震阻尼',
      '三代同堂複合式格局',
      '一層兩戶雙電梯',
      '五星級飯店式管理'
    ],
    'https://images.unsplash.com/photo-1496302662116-35cc4f36df92?auto=format&fit=crop&w=1600&q=80',
    array[
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1494527492857-66e29fb2926e?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=1080&q=80'
    ],
    '(02) 2626-5566',
    '新北市淡水區中正東路一段 26 號',
    '2023 Q3',
    false
  )
on conflict (slug) do update
set
  name = excluded.name,
  headline = excluded.headline,
  location = excluded.location,
  status = excluded.status,
  area_range = excluded.area_range,
  unit_type = excluded.unit_type,
  price_range = excluded.price_range,
  description = excluded.description,
  highlights = excluded.highlights,
  hero_image = excluded.hero_image,
  gallery = excluded.gallery,
  contact_phone = excluded.contact_phone,
  address = excluded.address,
  launch_date = excluded.launch_date,
  is_featured = excluded.is_featured;

-- ============================================================
-- ABOUT PAGE: Default Content
-- ============================================================

insert into public.about_page (title, subtitle, description, stats, core_practices, milestones)
values (
  'Uphouse 的建築哲學：穩健、誠信、貼近生活',
  'Our Story',
  'Uphouse 建設成立於 2001 年，以「讓家回歸生活本質」為信念。20 餘年來我們專注於住宅開發，從土地評估、規劃設計到售後服務皆由專業團隊親自把關，累計交屋超過 2,800 戶，打造出一座座值得世代傳承的住宅地標。',
  '[
    {"label": "成立年", "value": "2001"},
    {"label": "累計交屋戶數", "value": "2,800+"},
    {"label": "永續建築認證", "value": "12 件"}
  ]'::jsonb,
  '[
    {
      "title": "城市選地策略",
      "description": "鎖定捷運、學區、醫療資源密集的交通門戶區域，結合生活機能與增值潛力。"
    },
    {
      "title": "永續建築工法",
      "description": "導入循環建材、智慧節能監控與低碳施工流程，追求建築與環境的長期共榮。"
    },
    {
      "title": "住戶全程陪伴",
      "description": "提供專屬顧問、雲端履約平台、交屋巡檢與保固維修，為住戶建立信任感。"
    }
  ]'::jsonb,
  '[
    {
      "year": "2005",
      "title": "首座北市捷運共構宅完銷",
      "description": "推出「擎天匯」系列首案，締造 45 天完銷紀錄。"
    },
    {
      "year": "2012",
      "title": "導入永續建築標準",
      "description": "跨足淡水新市鎮，取得首座 EEWH 銅級綠建築標章。"
    },
    {
      "year": "2019",
      "title": "數位交屋服務啟動",
      "description": "建立雲端履約系統，提供線上選配、保固追蹤與即時客服。"
    },
    {
      "year": "2024",
      "title": "品牌升級為 Uphouse",
      "description": "推出永續品牌策略，強化「建築即生活」品牌定位。"
    }
  ]'::jsonb
)
on conflict (id) do nothing;
