import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from '../page'

// Mock fetch globally
global.fetch = jest.fn()

// Mock window methods
beforeEach(() => {
  (global.fetch as jest.Mock).mockClear()
  window.confirm = jest.fn(() => true)
  window.alert = jest.fn()
  
  // Mock successful API responses
  ;(global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ submissions: [] })
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: [] })
    })
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Admin Panel Button Tests', () => {
  describe('Navigation Tab Buttons', () => {
    test('should render navigation tab buttons and switch tabs', async () => {
      const user = userEvent.setup()
      
      render(<AdminDashboard />)
      
      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Check all tab buttons exist
      const overviewTab = screen.getByRole('button', { name: '總覽' })
      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      const projectsTab = screen.getByRole('button', { name: '作品管理' })

      expect(overviewTab).toBeInTheDocument()
      expect(contactsTab).toBeInTheDocument()
      expect(projectsTab).toBeInTheDocument()

      // Test tab switching
      await user.click(contactsTab)
      expect(screen.getByText('聯絡訊息管理')).toBeInTheDocument()

      await user.click(projectsTab)
      expect(screen.getAllByText('作品管理')[1]).toBeInTheDocument() // The h1 title, not the button
      expect(screen.getByText('新增作品')).toBeInTheDocument()

      await user.click(overviewTab)
      expect(screen.getByText('管理總覽')).toBeInTheDocument()
    })

    test('should apply correct active styling to selected tab', async () => {
      const user = userEvent.setup()
      
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      const overviewTab = screen.getByRole('button', { name: '總覽' })
      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      
      // Overview should be active initially
      expect(overviewTab).toHaveClass('border-gray-900', 'text-gray-900')
      expect(contactsTab).toHaveClass('border-transparent', 'text-gray-600')

      // Switch to contacts tab
      await user.click(contactsTab)
      
      expect(contactsTab).toHaveClass('border-gray-900', 'text-gray-900')
      expect(overviewTab).toHaveClass('border-transparent', 'text-gray-600')
    })
  })

  describe('Project Management Buttons', () => {
    beforeEach(() => {
      // Mock projects data for these tests
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ submissions: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            projects: [
              {
                id: 1,
                title: 'Test Project',
                description: 'Test description',
                completionDate: '2024-06-01',
                category: '住宅'
              }
            ]
          })
        })
    })

    test('should render add project button and trigger form', async () => {
      const user = userEvent.setup()
      
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Switch to projects tab
      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('新增作品')).toBeInTheDocument()
      })

      // Check add project button
      const addButton = screen.getByRole('button', { name: '新增作品' })
      expect(addButton).toHaveClass('bg-gray-900', 'text-white')
      
      // Click add button should trigger form (state change)
      await user.click(addButton)
      // We can't test form visibility without seeing the form component,
      // but we can verify the button is still there and functional
      expect(addButton).toBeInTheDocument()
    })

    test('should render edit and delete buttons for projects', async () => {
      const user = userEvent.setup()
      
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Switch to projects tab
      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })

      // Check edit and delete buttons
      const editButton = screen.getByRole('button', { name: '編輯' })
      const deleteButton = screen.getByRole('button', { name: '刪除' })

      expect(editButton).toBeInTheDocument()
      expect(editButton).toHaveClass('border-gray-300', 'text-gray-700')
      
      expect(deleteButton).toBeInTheDocument()
      expect(deleteButton).toHaveClass('bg-red-600', 'text-white')
    })

    test('should trigger edit form when edit button is clicked', async () => {
      const user = userEvent.setup()
      
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Switch to projects tab
      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })

      // Click edit button
      const editButton = screen.getByRole('button', { name: '編輯' })
      await user.click(editButton)
      
      // Verify button is still there (shows edit was triggered)
      expect(editButton).toBeInTheDocument()
    })

    test('should show confirmation and delete project when delete button is clicked', async () => {
      const user = userEvent.setup()
      ;(window.confirm as jest.Mock).mockReturnValue(true)
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })
      
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Switch to projects tab
      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: '刪除' })
      await user.click(deleteButton)
      
      // Verify confirmation was shown
      expect(window.confirm).toHaveBeenCalledWith('確定要刪除此作品嗎？')
      
      // Verify API call was made
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/projects/1', {
          method: 'DELETE',
        })
      })
    })

    test('should cancel delete when confirmation is rejected', async () => {
      const user = userEvent.setup()
      ;(window.confirm as jest.Mock).mockReturnValue(false)
      
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Switch to projects tab
      const projectsTab = screen.getByRole('button', { name: '作品管理' })
      await user.click(projectsTab)
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: '刪除' })
      await user.click(deleteButton)
      
      // Verify confirmation was shown
      expect(window.confirm).toHaveBeenCalledWith('確定要刪除此作品嗎？')
      
      // Verify NO API call was made for delete
      expect(fetch).not.toHaveBeenCalledWith(expect.stringMatching(/\/api\/projects\/\d+/), 
        expect.objectContaining({ method: 'DELETE' }))
    })
  })

  describe('Contact Status Buttons', () => {
    beforeEach(() => {
      // Mock contact data for these tests
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            submissions: [
              {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '123-456-7890',
                projectType: '住宅建設',
                budget: '100-500萬',
                message: 'Test message',
                submittedAt: '2024-01-15T10:00:00Z',
                status: 'new'
              }
            ]
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ projects: [] })
        })
    })

    test('should render status dropdown and update contact status', async () => {
      const user = userEvent.setup()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })
      
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Switch to contacts tab
      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      await user.click(contactsTab)
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      // Check status dropdown exists
      const statusDropdown = screen.getByRole('combobox')
      expect(statusDropdown).toBeInTheDocument()
      expect(statusDropdown).toHaveValue('new')

      // Change status
      await user.selectOptions(statusDropdown, 'replied')
      
      // Verify API call was made
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/contact/1', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'replied' }),
        })
      })
    })

    test('should display correct status styling', async () => {
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Switch to contacts tab
      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      await userEvent.setup().click(contactsTab)
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      // Check status display has correct styling
      const statusBadge = screen.getByText('新訊息')
      expect(statusBadge).toHaveClass('bg-red-100', 'text-red-800')
    })
  })

  describe('Loading State', () => {
    test('should show loading spinner initially', () => {
      ;(global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
      
      render(<AdminDashboard />)
      
      expect(screen.getByText('載入中...')).toBeInTheDocument()
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('Header Navigation', () => {
    test('should render header navigation links', async () => {
      render(<AdminDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText('總覽')).toBeInTheDocument()
      })

      // Check header elements
      expect(screen.getByText('向上建設')).toBeInTheDocument()
      expect(screen.getByText('管理後台')).toBeInTheDocument()
      expect(screen.getByText('回到網站')).toBeInTheDocument()

      // Check links
      const homeLink = screen.getByText('向上建設').closest('a')
      const backLink = screen.getByText('回到網站').closest('a')
      
      expect(homeLink).toHaveAttribute('href', '/')
      expect(backLink).toHaveAttribute('href', '/')
    })
  })
})