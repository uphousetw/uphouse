import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from '../page'

// Mock fetch globally
global.fetch = jest.fn()

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
      json: async () => ({ projects: [
        {
          id: 1,
          title: 'Test Project',
          description: 'Test description',
          completionDate: '2024-06-01',
          category: '住宅'
        }
      ]})
    })
})

describe('Admin Panel Button Functionality', () => {
  test('Should render all navigation tab buttons', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '總覽' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '聯絡訊息' })).toBeInTheDocument() 
      expect(screen.getByRole('button', { name: '作品管理' })).toBeInTheDocument()
    })
  })

  test('Should apply correct active styling to tabs', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      const overviewTab = screen.getByRole('button', { name: '總覽' })
      const contactsTab = screen.getByRole('button', { name: '聯絡訊息' })
      
      expect(overviewTab).toHaveClass('border-gray-900', 'text-gray-900')
      expect(contactsTab).toHaveClass('border-transparent', 'text-gray-600')
    })
  })

  test('Should render add project button in projects tab', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '總覽' })).toBeInTheDocument()
    })

    const projectsTab = screen.getByRole('button', { name: '作品管理' })
    await user.click(projectsTab)
    
    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: '新增作品' })
      expect(addButton).toBeInTheDocument()
      expect(addButton).toHaveClass('bg-gray-900', 'text-white')
    })
  })

  test('Should render edit and delete buttons for each project', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '總覽' })).toBeInTheDocument()
    })

    const projectsTab = screen.getByRole('button', { name: '作品管理' })
    await user.click(projectsTab)
    
    await waitFor(() => {
      const editButton = screen.getByRole('button', { name: '編輯' })
      const deleteButton = screen.getByRole('button', { name: '刪除' })

      expect(editButton).toBeInTheDocument()
      expect(editButton).toHaveClass('border-gray-300', 'text-gray-700')
      
      expect(deleteButton).toBeInTheDocument()
      expect(deleteButton).toHaveClass('bg-red-600', 'text-white')
    })
  })

  test('Should show confirmation dialog when delete button clicked', async () => {
    const user = userEvent.setup()
    ;(window.confirm as jest.Mock).mockReturnValue(true)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })
    
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '總覽' })).toBeInTheDocument()
    })

    const projectsTab = screen.getByRole('button', { name: '作品管理' })
    await user.click(projectsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: '刪除' })
    await user.click(deleteButton)
    
    expect(window.confirm).toHaveBeenCalledWith('確定要刪除此作品嗎？')
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/projects/1', {
        method: 'DELETE',
      })
    })
  })

  test('Should show loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<AdminDashboard />)
    
    expect(screen.getByText('載入中...')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  test('Should render header navigation correctly', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('向上建設')).toBeInTheDocument()
      expect(screen.getByText('管理後台')).toBeInTheDocument()
      expect(screen.getByText('回到網站')).toBeInTheDocument()

      const homeLink = screen.getByText('向上建設').closest('a')
      const backLink = screen.getByText('回到網站').closest('a')
      
      expect(homeLink).toHaveAttribute('href', '/')
      expect(backLink).toHaveAttribute('href', '/')
    })
  })
})