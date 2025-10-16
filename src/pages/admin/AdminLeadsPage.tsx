import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'

import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  message: string | null
  created_at: string
}

export const AdminLeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    setLoading(true)
    const { data, error: queryError } = await supabase
      .from<Lead>('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
    } else if (data) {
      setLeads(data)
      setError(null)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchLeads()
  }, [fetchLeads])

  const handleDelete = async (id: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    setRemoving(id)
    const { error: deleteError } = await supabase.from('leads').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
    } else {
      setLeads((prev) => prev.filter((lead) => lead.id !== id))
    }

    setRemoving(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">潛在客戶</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            查看並管理前台聯絡表單送出的 leads。
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchLeads()}
          className="mt-3 inline-flex items-center rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-primary hover:text-primary md:mt-0"
        >
          重新整理
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          無法載入潛在客戶資料：{error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">
              目前尚無潛在客戶紀錄。
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {lead.name}{' '}
                    <span className="ml-2 text-xs text-muted-foreground">{lead.phone}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lead.message || '（未填寫訊息）'}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {format(new Date(lead.created_at), 'yyyy/MM/dd HH:mm')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(lead.id)}
                    disabled={removing === lead.id}
                    className="rounded-full border border-border px-3 py-1 transition hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isSupabaseConfigured ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          尚未設定 Supabase 環境變數，無法連線至 leads 資料表。
        </div>
      ) : null}
    </div>
  )
}
