-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  image TEXT,
  completion_date TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  area TEXT,
  features TEXT[] DEFAULT '{}',
  gallery TEXT[] DEFAULT '{}',
  brand_logos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '未讀' CHECK (status IN ('未讀', '已讀', '已回覆')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON hero_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on projects" ON projects
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on hero_images" ON hero_images
  FOR SELECT TO public USING (true);

-- Admin policies (for authenticated users - you can adjust this)
CREATE POLICY "Allow all operations for authenticated users on projects" ON projects
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users on hero_images" ON hero_images
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users on contacts" ON contacts
  FOR ALL TO authenticated USING (true);

-- Insert your actual portfolio data
INSERT INTO projects (id, title, description, full_description, image, completion_date, category, location, area, features, gallery, brand_logos) VALUES
(
  1,
  '拾壹間(已完銷)',
  '位於台北市的現代簡約風格別墅，採用大面積玻璃窗設計，讓自然光線充分進入室內空間。',
  '這是一個位於台北市精華地段的現代簡約風格別墅項目。設計以大面積玻璃窗為特色，讓自然光線充分進入室內空間，創造出開闊明亮的居住環境。',
  '/images/projects/1757997792250____.jpg',
  '2025/12',
  '透天',
  '台北市大安區',
  '30',
  ARRAY['大面積玻璃窗', '開放式格局', '進口石材', '實木地板', '智慧家居系統'],
  ARRAY['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
  '[
    {"name": "sakura", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757997792390_sakura.png"},
    {"name": "螢幕擷取畫面 2025-09-11 122745", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757997792411________2025-09-11_122745.png"}
  ]'::jsonb
),
(
  2,
  '八宅',
  '5層樓電梯華廈',
  '2-3房八席珍藏: 靜享簡約生活\n全平面車位: 日常進出輕鬆自在\n★基地位置：苗栗縣後龍鎮新東路（栗園米食對面）',
  '/images/projects/1757999572546_1757393089704___.jpg',
  '2026年12月',
  '華廈',
  '苗栗縣後龍鎮新東路',
  '30、42坪',
  ARRAY['多功能空間設計', '高效收納系統', '現代簡約風格', '優質建材', '節能環保設計'],
  ARRAY['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
  '[
    {"name": "bosch", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757999573997_bosch.svg"},
    {"name": "grohe-2", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757999573952_grohe-2.svg"},
    {"name": "kronotex", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757999573952_kronotex.png"},
    {"name": "philips", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757999574456_philips.svg"},
    {"name": "sakura", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757999575281_sakura.png"},
    {"name": "villeroy-boch", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757999575987_villeroy-boch.svg"},
    {"name": "ykkap-logo", "category": "合作品牌", "logoUrl": "/images/brand-logos/1757999575987_ykkap-logo.svg"}
  ]'::jsonb
),
(
  3,
  '六埕',
  '珍稀六戶: 每戶皆是獨一無二的私藏',
  '均值80坪: 尺度寬敞、生活更從容\n\n農+建雙重地貌: 保有生活彈性與未來潛力\n\n獨棟雙拼設計: 動線分明、住戶單純、居家隱私高 (封閉型社區)\n\n無須捨棄空間與品質，一次滿足你對家的所有想像。\n\n★基地位置：苗栗縣後龍鎮二張犁段 (近造豐路全家)',
  '/images/projects/1758003559804___.jpg',
  '2026年12月',
  '透天',
  '',
  '80坪',
  ARRAY['多功能空間設計', '高效收納系統', '現代簡約風格', '優質建材', '節能環保設計'],
  ARRAY[]::text[],
  '[
    {"name": "bosch", "category": "合作品牌", "logoUrl": "/images/brand-logos/1758003561146_bosch.svg"},
    {"name": "grohe-2", "category": "合作品牌", "logoUrl": "/images/brand-logos/1758003561141_grohe-2.svg"},
    {"name": "kronotex", "category": "合作品牌", "logoUrl": "/images/brand-logos/1758003561142_kronotex.png"},
    {"name": "philips", "category": "合作品牌", "logoUrl": "/images/brand-logos/1758003561142_philips.svg"},
    {"name": "sakura", "category": "合作品牌", "logoUrl": "/images/brand-logos/1758003561143_sakura.png"},
    {"name": "villeroy-boch", "category": "合作品牌", "logoUrl": "/images/brand-logos/1758003561253_villeroy-boch.svg"},
    {"name": "ykkap-logo", "category": "合作品牌", "logoUrl": "/images/brand-logos/1758003561304_ykkap-logo.svg"},
    {"name": "螢幕擷取畫面 2025-09-11 122745", "category": "合作品牌", "logoUrl": "/images/brand-logos/1758003561307________2025-09-11_122745.png"}
  ]'::jsonb
);

-- Set the sequence to continue from the highest ID
SELECT setval('projects_id_seq', 3, true);

-- Insert sample hero images
INSERT INTO hero_images (title, image, description, order_index) VALUES
('現代建築設計', '/api/placeholder/1200/600', '展示現代建築的簡潔美學', 1),
('室內空間規劃', '/api/placeholder/1200/600', '精心設計的室內空間配置', 2),
('建材品質展示', '/api/placeholder/1200/600', '使用頂級建材打造品質住宅', 3);