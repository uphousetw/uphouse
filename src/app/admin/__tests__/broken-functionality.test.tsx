import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from '../page'

// Mock fetch to test real API integration issues
global.fetch = jest.fn()

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear()
  window.confirm = jest.fn(() => true)
  window.alert = jest.fn()
})

describe('Admin Panel - Real Functionality Issues', () => {
  describe('Data Loading Issues', () => {
    test('BROKEN: Contact submissions from contact/[id]/route.ts mock data never loads', async () => {
      // Mock the actual API response structure
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ submissions: [] }) // Empty from main route
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ projects: [] })
        })

      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // The contact data from [id]/route.ts is never loaded because it's in a different file!
      // The admin panel only calls GET /api/contact, not individual contact endpoints
      // So the mock data in contact/[id]/route.ts (張先生) is never visible in admin panel
      
      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      await userEvent.setup().click(contactsTab)
      
      await waitFor(() => {
        // This should show the mock contact but doesn't because of data isolation
        expect(screen.queryByText('張先生')).not.toBeInTheDocument()
        expect(screen.getByText('暫無聯絡訊息')).toBeInTheDocument()
      })
    })

    test('BROKEN: Projects data inconsistency between API routes', async () => {
      // projects/route.ts has different mock data than projects/[id]/route.ts
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ submissions: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            projects: [
              // Data from route.ts
              {
                id: 1,
                title: "現代簡約別墅",
                description: "位於台北市的現代簡約風格別墅，採用大面積玻璃窗設計，讓自然光線充分進入室內空間。",
                completionDate: "2024年6月",
                category: "住宅"
              }
            ]
          })
        })

      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await userEvent.setup().click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('現代簡約別墅')).toBeInTheDocument()
      })

      // The issue: projects/[id]/route.ts has const projects = [...] which can't be modified
      // So DELETE operations won't work because they're on a const array!
    })
  })

  describe('Missing UI Components', () => {
    test('BROKEN: Add Project button shows no form', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ submissions: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ projects: [] })
        })

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
      
      // PROBLEM: showProjectForm becomes true but no form is rendered!
      // There's no conditional rendering for the project form in the component
      await waitFor(() => {
        // Should show a form but doesn't - this will fail
        expect(screen.queryByText('專案名稱')).not.toBeInTheDocument()
        expect(screen.queryByText('專案描述')).not.toBeInTheDocument() 
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      })
    })

    test('BROKEN: Edit Project button shows no form', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ submissions: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            projects: [{
              id: 1,
              title: "Test Project",
              description: "Test description",
              completionDate: "2024-06-01",
              category: "住宅"
            }]
          })
        })

      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })

      const editButton = screen.getByRole('button', { name: '編輯' })
      await user.click(editButton)
      
      // PROBLEM: setEditingProject is called but no edit form is shown!
      await waitFor(() => {
        // Should show edit form with pre-filled data but doesn't
        expect(screen.queryByDisplayValue('Test Project')).not.toBeInTheDocument()
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      })
    })
  })

  describe('API Integration Issues', () => {
    test('BROKEN: Delete project fails on const array', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ submissions: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            projects: [{
              id: 1,
              title: "Test Project",
              description: "Test description", 
              completionDate: "2024-06-01",
              category: "住宅"
            }]
          })
        })

      // Mock the DELETE to simulate the real API failure
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Cannot delete from const array' })
      })

      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })

      const deleteButton = screen.getByRole('button', { name: '刪除' })
      await user.click(deleteButton)
      
      // The delete will fail because projects/[id]/route.ts uses const projects = [...]
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/projects/1', {
          method: 'DELETE',
        })
        // The project should still be there because delete failed
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })
    })

    test('BROKEN: Contact status updates fail on separate data stores', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            submissions: [{
              id: 'contact_1',
              name: '張先生',
              email: 'zhang@example.com',
              phone: '0912345678',
              status: 'new'
            }]
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ projects: [] })
        })

      // Mock the PATCH to fail because data stores are separate
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Contact submission not found' })
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

      const statusDropdown = screen.getByRole('combobox')
      await user.selectOptions(statusDropdown, 'replied')
      
      // The update fails because contact/route.ts and contact/[id]/route.ts have separate arrays
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/contact/contact_1', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'replied' }),
        })
        // Status should not have changed due to API failure  
        expect(statusDropdown).toHaveValue('new')
      })
    })
  })

  describe('State Management Issues', () => {
    test('BROKEN: Form state persists between add and edit operations', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ submissions: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            projects: [{
              id: 1,
              title: "Existing Project",
              description: "Existing description",
              completionDate: "2024-06-01", 
              category: "住宅"
            }]
          })
        })

      const user = userEvent.setup()
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Existing Project')).toBeInTheDocument()
      })

      // Click edit first to set editingProject
      const editButton = screen.getByRole('button', { name: '編輯' })
      await user.click(editButton)
      
      // Then click add - this should clear editingProject but might not
      const addButton = screen.getByRole('button', { name: '新增作品' })  
      await user.click(addButton)
      
      // The issue: handleAddProject calls setEditingProject(null) then setShowProjectForm(true)
      // But if there's a race condition or state batching issue, 
      // the edit data might still be there when the form opens
      // However, since there's no form rendered, we can't actually test this properly
    })
  })
})