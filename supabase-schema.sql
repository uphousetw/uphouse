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

-- Insert sample data
INSERT INTO projects (title, description, full_description, image, completion_date, category, location, area, features, gallery, brand_logos) VALUES
(
  '現代簡約別墅',
  '位於台北市的現代簡約風格別墅，採用大面積玻璃窗設計，讓自然光線充分進入室內空間。',
  '這是一個位於台北市精華地段的現代簡約風格別墅項目。設計以大面積玻璃窗為特色，讓自然光線充分進入室內空間，創造出開闊明亮的居住環境。',
  '/api/placeholder/800/600',
  '2024年6月',
  '透天',
  '台北市大安區',
  '280坪',
  ARRAY['大面積玻璃窗', '開放式格局', '進口石材', '實木地板', '智慧家居系統'],
  ARRAY['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
  '[
    {"name": "台灣水泥", "category": "水泥製造"},
    {"name": "潤泰建材", "category": "綜合建材"},
    {"name": "三商建材", "category": "建築材料"},
    {"name": "國產建材實業", "category": "建材實業"}
  ]'::jsonb
),
(
  '都會雅居',
  '坐落於新北市的都會住宅設計，強調空間的多功能性與收納效率。',
  '都會雅居項目位於新北市核心區域，是專為現代都會人士打造的精緻住宅。設計特別強調空間的多功能性與收納效率。',
  '/api/placeholder/800/600',
  '2024年9月',
  '華廈',
  '新北市板橋區',
  '120坪',
  ARRAY['多功能空間設計', '高效收納系統', '現代簡約風格', '優質建材', '節能環保設計'],
  ARRAY['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
  '[
    {"name": "和成建材", "category": "衛浴設備"},
    {"name": "台塑建材", "category": "塑膠建材"},
    {"name": "潤泰建材", "category": "綜合建材"},
    {"name": "國產建材實業", "category": "建材實業"}
  ]'::jsonb
);

-- Insert sample hero images
INSERT INTO hero_images (title, image, description, order_index) VALUES
('現代建築設計', '/api/placeholder/1200/600', '展示現代建築的簡潔美學', 1),
('室內空間規劃', '/api/placeholder/1200/600', '精心設計的室內空間配置', 2),
('建材品質展示', '/api/placeholder/1200/600', '使用頂級建材打造品質住宅', 3);