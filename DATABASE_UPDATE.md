# 資料庫更新說明：新增經緯度欄位

## 更新內容

為了支援地圖顯示功能，已在 `projects` 表中新增兩個欄位：
- `latitude` (numeric(10, 7)) - 緯度
- `longitude` (numeric(10, 7)) - 經度

## 如何更新 Supabase 資料庫

### 方法 1：使用 Supabase SQL Editor（推薦）

1. **登入 Supabase Dashboard**
   - 前往 https://supabase.com/dashboard
   - 選擇您的專案

2. **打開 SQL Editor**
   - 點擊左側選單的 **SQL Editor**
   - 點擊 **New query**

3. **執行 Schema 更新**
   複製並執行以下 SQL（或直接執行整個 `supabase/schema.sql` 檔案）：

   ```sql
   -- 新增經緯度欄位
   alter table public.projects
     add column if not exists latitude numeric(10, 7);

   alter table public.projects
     add column if not exists longitude numeric(10, 7);
   ```

4. **更新現有資料（可選）**
   如果您想用範例資料更新現有建案，複製並執行 `supabase/seed.sql` 的內容。

### 方法 2：手動新增欄位

1. 前往 Supabase Dashboard → **Table Editor**
2. 選擇 `projects` 表
3. 點擊右上角的 **Add Column**
4. 新增第一個欄位：
   - Name: `latitude`
   - Type: `numeric`
   - Length: 10, 7 (precision: 10, scale: 7)
   - Default value: (留空)
   - Nullable: ✓ 允許
5. 重複步驟 4，新增 `longitude` 欄位

### 方法 3：使用 Supabase CLI（進階）

如果您有安裝 Supabase CLI：

```bash
# 確保已登入
supabase login

# 連結專案
supabase link --project-ref your-project-ref

# 執行 schema
supabase db push
```

## 驗證更新

執行以下 SQL 查詢來驗證欄位已新增：

```sql
select column_name, data_type, numeric_precision, numeric_scale
from information_schema.columns
where table_name = 'projects'
  and column_name in ('latitude', 'longitude');
```

應該會看到：

| column_name | data_type | numeric_precision | numeric_scale |
|------------|-----------|-------------------|---------------|
| latitude   | numeric   | 10                | 7             |
| longitude  | numeric   | 10                | 7             |

## 範例經緯度

台北地區常用經緯度參考：

- **台北 101**：25.0340, 121.5645
- **信義區**：25.0330, 121.5654
- **林口 A7**：25.0777, 121.3581
- **淡水**：25.1537, 121.4595
- **台北車站**：25.0478, 121.5170
- **松山機場**：25.0636, 121.5522

## 如何取得任意地址的經緯度

1. 前往 [Google Maps](https://www.google.com/maps)
2. 搜尋地址或地點
3. 在地圖上點擊該位置
4. 底部會顯示經緯度（例如：25.0330, 121.5654）
5. 點擊經緯度可複製

## 更新後的資料結構

```typescript
interface Project {
  // ... 其他欄位
  address: string        // 完整地址
  latitude: number       // 緯度（必填）
  longitude: number      // 經度（必填）
}
```

## 相關檔案

- `supabase/schema.sql` - 完整資料庫結構（包含新欄位）
- `supabase/seed.sql` - 範例資料（包含經緯度）
- `src/data/projects.ts` - TypeScript 型別定義
- `src/components/MapEmbed.tsx` - 地圖顯示組件
