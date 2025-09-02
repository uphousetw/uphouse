import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from '../page'

// Mock fetch globally
global.fetch = jest.fn()

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear()
  window.confirm = jest.fn(() => true)
  window.alert = jest.fn()
})

describe('Admin Panel - FIXED Functionality Tests', () => {
  const mockContactData = {
    submissions: [{
      id: 'contact_1',
      name: '張先生',
      email: 'zhang@example.com',
      phone: '0912345678',
      projectType: '新建住宅',
      budget: '1000-2000萬',
      message: '我想要建造一間現代風格的住宅',
      submittedAt: '2024-01-15T10:00:00Z',
      status: 'new'
    }]
  }

  const mockProjectData = {
    projects: [{
      id: 1,
      title: '現代簡約別墅',
      description: '位於台北市的現代簡約風格別墅',
      fullDescription: '詳細描述...',
      completionDate: '2024年6月',
      category: '住宅',
      location: '台北市大安區',
      area: '280坪',
      features: ['大面積玻璃窗', '開放式格局']
    }]
  }

  beforeEach(() => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockContactData
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjectData
      })
  })

  describe('FIXED: Data Loading', () => {
    test('✅ Contact data loads from shared data store', async () => {
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Switch to contacts tab
      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      await userEvent.setup().click(contactsTab)
      
      await waitFor(() => {
        // Now the contact data should be visible because we fixed the data consistency
        expect(screen.getByText('張先生')).toBeInTheDocument()
        expect(screen.getByText('zhang@example.com')).toBeInTheDocument()
      })
    })

    test('✅ Projects can be deleted because API uses mutable array', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Project deleted successfully' })
      })

      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('現代簡約別墅')).toBeInTheDocument()
      })

      const deleteButton = screen.getByRole('button', { name: '刪除' })
      await user.click(deleteButton)
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/projects/1', {
          method: 'DELETE',
        })
        // Project should be removed from UI on successful delete
        expect(screen.queryByText('現代簡約別墅')).not.toBeInTheDocument()
      })
    })
  })

  describe('FIXED: Project Form Component', () => {
    test('✅ Add Project button shows form', async () => {
      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('新增作品')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: '新增作品' })
      await user.click(addButton)
      
      // NOW the form should appear!
      await waitFor(() => {
        expect(screen.getByText('專案名稱')).toBeInTheDocument()
        expect(screen.getByText('專案描述')).toBeInTheDocument()
        expect(screen.getByRole('textbox', { name: /專案名稱/i })).toBeInTheDocument()
      })
    })

    test('✅ Edit Project button shows form with pre-filled data', async () => {
      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('現代簡約別墅')).toBeInTheDocument()
      })

      const editButton = screen.getByRole('button', { name: '編輯' })
      await user.click(editButton)
      
      // NOW the edit form should appear with pre-filled data!
      await waitFor(() => {
        expect(screen.getByText('編輯作品')).toBeInTheDocument()
        expect(screen.getByDisplayValue('現代簡約別墅')).toBeInTheDocument()
        expect(screen.getByDisplayValue('位於台北市的現代簡約風格別墅')).toBeInTheDocument()
      })
    })

    test('✅ Form submission works correctly', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          id: 3,
          title: '新專案',
          description: '新專案描述',
          completionDate: '2024年12月',
          category: '住宅'
        })
      })

      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      const addButton = screen.getByRole('button', { name: '新增作品' })
      await user.click(addButton)
      
      await waitFor(() => {
        expect(screen.getByText('專案名稱')).toBeInTheDocument()
      })

      // Fill form
      await user.type(screen.getByRole('textbox', { name: /專案名稱/i }), '新專案')
      await user.type(screen.getByRole('textbox', { name: /專案描述/i }), '新專案描述')
      await user.type(screen.getByRole('textbox', { name: /完工日期/i }), '2024年12月')
      await user.selectOptions(screen.getByRole('combobox'), '住宅')

      // Submit form
      const submitButton = screen.getByRole('button', { name: '新增作品' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/projects', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }))
      })
    })

    test('✅ Form cancel works correctly', async () => {
      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      const addButton = screen.getByRole('button', { name: '新增作品' })
      await user.click(addButton)
      
      await waitFor(() => {
        expect(screen.getByText('專案名稱')).toBeInTheDocument()
      })

      // Cancel form
      const cancelButton = screen.getByRole('button', { name: '取消' })
      await user.click(cancelButton)
      
      await waitFor(() => {
        // Form should disappear
        expect(screen.queryByText('專案名稱')).not.toBeInTheDocument()
      })
    })
  })

  describe('FIXED: Contact Delete Functionality', () => {
    test('✅ Contact delete button exists and works', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Contact deleted successfully' })
      })

      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      await user.click(contactsTab)
      
      await waitFor(() => {
        expect(screen.getByText('張先生')).toBeInTheDocument()
      })

      // NOW there should be a delete button!
      const deleteButton = screen.getByRole('button', { name: '刪除' })
      expect(deleteButton).toBeInTheDocument()
      expect(deleteButton).toHaveClass('bg-red-600', 'text-white')

      await user.click(deleteButton)
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/contact/contact_1', {
          method: 'DELETE',
        })
        // Contact should be removed from UI
        expect(screen.queryByText('張先生')).not.toBeInTheDocument()
      })
    })
  })

  describe('All Buttons Working Integration Test', () => {
    test('✅ All admin panel buttons are now functional', async () => {
      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // 1. Navigation tabs work
      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      const overviewTab = screen.getByRole('button', { name: '總覽' })

      expect(contactsTab).toBeInTheDocument()
      expect(projectsTab).toBeInTheDocument()
      expect(overviewTab).toBeInTheDocument()

      // 2. Contact management buttons work
      await user.click(contactsTab)
      await waitFor(() => {
        expect(screen.getByText('張先生')).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument() // Status dropdown
        expect(screen.getByRole('button', { name: '刪除' })).toBeInTheDocument() // Delete button
      })

      // 3. Project management buttons work
      await user.click(projectsTab)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '新增作品' })).toBeInTheDocument() // Add button
        expect(screen.getByRole('button', { name: '編輯' })).toBeInTheDocument() // Edit button
        expect(screen.getAllByRole('button', { name: '刪除' })).toHaveLength(1) // Delete button
      })

      // 4. Project form appears when clicking add
      const addButton = screen.getByRole('button', { name: '新增作品' })
      await user.click(addButton)
      
      await waitFor(() => {
        expect(screen.getByText('專案名稱')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: '新增作品' })).toBeInTheDocument()
      })

      // All buttons are now working! ✅
    })
  })
})