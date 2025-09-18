# 向上建設 - 建築設計網站

這是向上建設的官方網站，展示專業建築設計服務與作品集。

## 技術棧

- **Frontend**: React 19 + Next.js 15
- **Styling**: Tailwind CSS 4
- **語言**: TypeScript
- **部署**: Vercel

## 功能特色

### 用戶端
- 🏠 **首頁** - 公司介紹與服務概覽
- 📱 **響應式設計** - 完美適配各種設備
- 🎨 **McKinsey風格設計** - 優雅簡潔的視覺風格
- 📧 **聯絡表單** - 客戶詢問與需求收集
- 🏗️ **作品集** - 建案展示（每頁3個作品，支持分頁）
- ℹ️ **關於我們** - 公司歷史、團隊與核心價值

### 管理後台
- 📊 **管理總覽** - 統計數據與快速概覽
- 📨 **訊息管理** - 查看與管理客戶聯絡訊息
- 🏠 **作品管理** - 新增、編輯、刪除作品項目
- 🔄 **狀態更新** - 即時更新訊息處理狀態

### API 功能
- `/api/projects` - 作品項目 CRUD 操作
- `/api/contact` - 聯絡表單提交與管理

## 本地開發

### 環境要求
- Node.js 18+ 
- npm 或 yarn

### 安裝與執行

1. 克隆倉庫
```bash
git clone <repository-url>
cd construction-website
```

2. 安裝依賴
```bash
npm install
```

3. 啟動開發服務器
```bash
npm run dev
```

4. 開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 可用腳本

- `npm run dev` - 啟動開發服務器（使用 Turbopack）
- `npm run build` - 建置生產版本
- `npm start` - 啟動生產服務器
- `npm run lint` - 執行 ESLint 檢查

## 部署到 Vercel

### 方法一：GitHub 自動部署（推薦）

1. 將代碼推送到 GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. 登入 [Vercel Dashboard](https://vercel.com)

3. 點擊 "New Project" 並連接你的 GitHub 倉庫

4. 配置項目：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. 點擊 "Deploy" - Vercel 會自動建置並部署你的網站

### 方法二：Vercel CLI 部署

1. 安裝 Vercel CLI
```bash
npm install -g vercel
```

2. 登入 Vercel
```bash
vercel login
```

3. 部署項目
```bash
vercel
```

## 項目結構

```
construction-website/
├── src/
│   ├── app/                    # App Router 頁面
│   │   ├── page.tsx           # 首頁
│   │   ├── about/             # 關於我們
│   │   ├── portfolio/         # 作品集
│   │   ├── contact/           # 聯絡我們
│   │   ├── admin/             # 管理後台
│   │   ├── api/               # API 路由
│   │   │   ├── projects/      # 作品 API
│   │   │   └── contact/       # 聯絡表單 API
│   │   ├── layout.tsx         # 根佈局
│   │   └── globals.css        # 全局樣式
│   └── components/            # 組件
│       ├── Header.tsx         # 頁頭導航
│       └── Footer.tsx         # 頁腳
├── public/                    # 靜態資源
├── package.json
├── tailwind.config.ts         # Tailwind 配置
├── tsconfig.json             # TypeScript 配置
└── README.md
```

## 設計理念

網站採用 McKinsey & Company 風格的設計語言：

- **簡潔優雅** - 最小化設計元素，突出內容本身
- **專業可信** - 使用中性色調與清晰字體
- **用戶友好** - 直觀的導航與良好的用戶體驗
- **響應式** - 在所有設備上都有完美的展示效果

## 訪問地址

- **主網站**: [http://localhost:3000](http://localhost:3000)
- **管理後台**: [http://localhost:3000/admin](http://localhost:3000/admin)

## 自定義與擴展

### 修改公司資訊
編輯以下文件來更新公司資訊：
- `src/app/layout.tsx` - 網站標題與描述
- `src/components/Header.tsx` - 導航菜單
- `src/components/Footer.tsx` - 聯絡資訊

### 添加新作品
1. 使用管理後台的作品管理功能
2. 或直接編輯 `src/app/api/projects/route.ts` 中的數據

### 修改樣式
- 編輯 `tailwind.config.ts` 來自定義顏色和字體
- 修改組件中的 Tailwind 類名來調整樣式

## 生產部署考量

### 數據庫
目前使用內存數據存儲，生產環境建議：
- 使用 PostgreSQL 或 MongoDB
- 整合 Prisma 或 MongoDB Atlas

### 圖片管理
- 整合 Cloudinary 或 AWS S3
- 實現圖片上傳功能

### 身份驗證
- 為管理後台添加身份驗證
- 使用 NextAuth.js 或 Auth0

### 郵件服務
- 整合 SendGrid 或 Nodemailer
- 實現聯絡表單郵件通知

## 聯繫支持

如有技術問題或需要客制化開發，請聯繫：
- Email: info@uphouse.com.tw
- Phone: (02) 2xxx-xxxx

## 許可證

© 2024 向上建設. All rights reserved.
