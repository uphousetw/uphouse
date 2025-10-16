# Uphouse 建設品牌網站（MVP）

以 React + Vite + Tailwind CSS 打造的 Uphouse 建設品牌網站 MVP，前端完全使用 Supabase 資料驅動，目前包含完整的前台頁面與後台內容管理（無自訂後端程式）。

## 目錄
- [功能簡介](#功能簡介)
- [快速開始](#快速開始)
- [開發指引](#開發指引)
- [Supabase 設定](#supabase-設定)
- [後台管理教學](#後台管理教學)
- [部署（Cloudflare Pages）](#部署cloudflare-pages)
- [後續延伸建議](#後續延伸建議)

## 功能簡介
- 首頁：Hero、精選建案、品牌承諾、CTA。
- 關於我們：品牌故事、核心策略、里程碑。
- 建案一覽：依狀態篩選、建案卡片列表。
- 建案內頁：亮點、描述、相簿、銷售資訊。
- 聯絡我們：潛在客戶表單（寫入 Supabase `leads`）。
- 後台（Supabase Auth）：
  - 儀表板：建案數、精選數、潛在客戶統計。
  - 建案管理：新增 / 編輯 / 刪除，立即影響前台顯示。
  - 潛在客戶：檢視表單送出並可刪除。

## 快速開始
```bash
npm install
npm run dev
```
> 需要 Node.js 18+、npm 9+。`npm run build` 會輸出到 `dist/`。

## 開發指引
- 樣式 Token 與設計系統：`src/styles/globals.css`、`tailwind.config.ts`
- 路由：`src/routes.tsx`
- 前台版型：`src/layout/MainLayout.tsx`
- 前台頁面：
  - `src/pages/HomePage.tsx`
  - `src/pages/AboutPage.tsx`
  - `src/pages/ProjectsPage.tsx`
  - `src/pages/ProjectDetailPage.tsx`
  - `src/pages/ContactPage.tsx`
- 後台版型與頁面：
  - `src/layout/AdminLayout.tsx`
  - `src/pages/admin/AdminDashboard.tsx`
  - `src/pages/admin/AdminProjectsPage.tsx`
  - `src/pages/admin/AdminProjectFormPage.tsx`
  - `src/pages/admin/AdminLeadsPage.tsx`
  - `src/pages/admin/AdminLoginPage.tsx`
- 資料模型與映射：`src/data/projects.ts`
- Supabase 客戶端：`src/lib/supabaseClient.ts`

## Supabase 設定
1. 在 Supabase 建立專案後，於 **SQL Editor** 依序執行：
   - `supabase/schema.sql`：建立 `projects`、`leads`、`profiles` 表與 RLS、Trigger。
   - `supabase/seed_projects.sql`：若需範例建案，可視需要執行或調整後再載入。
2. 將 `.env.local` 新增以下內容（同時部署時也要設定）：
   ```
   VITE_SUPABASE_URL=<你的 Supabase Project URL>
   VITE_SUPABASE_ANON_KEY=<你的 Supabase anon key>
   ```
3. 如要使用 Playwright 檢查資料，可額外設定：
   ```
   ADMIN_EMAIL=<後台登入 Email>
   ADMIN_PASSWORD=<後台登入密碼>
   APP_URL=http://localhost:5173  # 若部署到其他網址請改成實際域名
   ```
4. 回到專案執行 `npm install`（會安裝 `@supabase/supabase-js`、`dotenv` 等套件），再跑 `npm run dev` 驗證前台與後台讀寫是否正常。

## 後台管理教學
- 登入頁：`/admin/login`，使用 Supabase Auth 帳號密碼。
- 儀表板：`/admin`，顯示建案與 leads 數據。
- 建案管理：
  - 列表：`/admin/projects`
  - 新增：`/admin/projects/new`
  - 編輯：`/admin/projects/:slug/edit`
  - 刪除：於列表按下刪除即可，會同步刪除 Supabase 資料。
- 潛在客戶：`/admin/leads`，可檢視與刪除表單資料。
- 角色權限：
  - 新建立的使用者預設為 `editor`（可瀏覽建案但無法讀取 leads）。
  - 需於 `profiles` 表將 `role` 更新為 `admin` 才能進入 leads 頁面。
  - Admin 角色擁有 Editor 所有權限，並可管理 leads 與 profiles。

## 部署（Cloudflare Pages）
1. 版本管理：將專案推到 Git 儲存庫（建議 GitHub）。
2. Cloudflare Pages 建立專案並連接儲存庫。
3. Build 指令：`npm run build`；Build Output：`dist`
4. 在 Pages → Settings → Environment Variables 新增：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - （可選）`APP_URL` 若要給 Playwright 例行檢查使用
5. 重新部署後即可上線；往後 push 到主分支會自動觸發重新建置。

## 後續延伸建議
1. **媒體與檔案**：整合 Supabase Storage 或 Cloudinary，後台提供圖片上傳。
2. **Flow 與權限**：加入多種角色（如 reviewer）、審核流程或草稿 / 發佈狀態。
3. **內容自動化**：導入 Edge Functions 處理表單通知、Turnstile 防刷或 leads 標註。
4. **測試與 CI**：以 Vitest/Playwright 撰寫測試，並在 GitHub Actions 建置前驗證。
5. **多語系 / SEO**：後續可加入 i18n、OG tag 管理或 sitemap 產生機制。

---

若要快速驗證 Supabase 權限，可執行：
```bash
npx tsx scripts/check-admin-access.ts
```
> 需先在 `.env.local` 或環境變數設定 Supabase URL/Key 與管理員帳密。
