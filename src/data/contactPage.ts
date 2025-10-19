export interface ContactPageContent {
  pageTitle: string
  pageDescription: string
  addressLabel: string
  addressValue: string
  businessHours: string
  phoneLabel: string
  phoneValue: string
  emailLabel: string
  emailValue: string
}

export interface ContactPageContentRow {
  id: string
  page_title: string
  page_description: string
  address_label: string
  address_value: string
  business_hours: string
  phone_label: string
  phone_value: string
  email_label: string
  email_value: string
  updated_at: string
  updated_by: string | null
}

export const mapContactPageContent = (row: ContactPageContentRow): ContactPageContent => ({
  pageTitle: row.page_title,
  pageDescription: row.page_description,
  addressLabel: row.address_label,
  addressValue: row.address_value,
  businessHours: row.business_hours,
  phoneLabel: row.phone_label,
  phoneValue: row.phone_value,
  emailLabel: row.email_label,
  emailValue: row.email_value,
})

export const defaultContactPageContent: ContactPageContent = {
  pageTitle: '聯絡我們',
  pageDescription: '填寫表單後，我們將盡速與您聯繫',
  addressLabel: '地址',
  addressValue: '台北市信義區松仁路 123 號 10 樓',
  businessHours: '營業時間：週一至週日 10:00-20:00',
  phoneLabel: '服務專線',
  phoneValue: '(02) 1234-5678',
  emailLabel: '客服信箱',
  emailValue: 'contact@uphouse.tw',
}
