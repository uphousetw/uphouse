export interface AboutStat {
  label: string
  value: string
}

export interface AboutCorePractice {
  title: string
  description: string
}

export interface AboutMilestone {
  year: string
  title: string
  description: string
}

export interface AboutPage {
  id?: string
  title: string
  subtitle?: string
  description: string
  stats: AboutStat[]
  corePractices: AboutCorePractice[]
  milestones: AboutMilestone[]
  updatedAt?: string
  updatedBy?: string
}

export interface AboutPageRow {
  id: string
  title: string
  subtitle: string | null
  description: string
  stats: AboutStat[]
  core_practices: AboutCorePractice[]
  milestones: AboutMilestone[]
  updated_at: string
  updated_by: string | null
}

export const mapAboutPage = (row: AboutPageRow): AboutPage => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle ?? undefined,
  description: row.description,
  stats: row.stats ?? [],
  corePractices: row.core_practices ?? [],
  milestones: row.milestones ?? [],
  updatedAt: row.updated_at,
  updatedBy: row.updated_by ?? undefined,
})
