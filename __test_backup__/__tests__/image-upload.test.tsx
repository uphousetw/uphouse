import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from '../page'

// Mock fetch globally
global.fetch = jest.fn()

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear()
  window.confirm = jest.fn(() => true)
  window.alert = jest.fn()
  
  // Mock API responses
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
          title: '現代簡約別墅',
          description: '位於台北市的現代簡約風格別墅',
          completionDate: '2024年6月',
          category: '住宅',
          image: '/api/placeholder/800/600',
          gallery: ['/api/placeholder/800/600', '/api/placeholder/800/600']
        }]
      })
    })
})

describe('Project Form Image Upload Functionality', () => {
  test('✅ Image upload fields appear in project form', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('總覽')).toBeInTheDocument()
    })

    // Go to projects tab
    const projectsTab = screen.getByRole('button', { name: '作品管理' })
    await user.click(projectsTab)
    
    await waitFor(() => {
      expect(screen.getByText('新增作品')).toBeInTheDocument()
    })

    // Open add project form
    const addButton = screen.getByRole('button', { name: '新增作品' })
    await user.click(addButton)
    
    await waitFor(() => {
      // Check for image upload fields
      expect(screen.getByText('主要圖片')).toBeInTheDocument()
      expect(screen.getByText('作品圖片集 (可選擇多張)')).toBeInTheDocument()
      
      // Check for file input elements
      const imageInput = screen.getByLabelText('主要圖片')
      const galleryInput = screen.getByLabelText('作品圖片集 (可選擇多張)')
      
      expect(imageInput).toBeInTheDocument()
      expect(imageInput).toHaveAttribute('type', 'file')
      expect(imageInput).toHaveAttribute('accept', 'image/*')
      
      expect(galleryInput).toBeInTheDocument()
      expect(galleryInput).toHaveAttribute('type', 'file')
      expect(galleryInput).toHaveAttribute('accept', 'image/*')
      expect(galleryInput).toHaveAttribute('multiple')
      
      // Check for helpful text
      expect(screen.getByText(/支援格式: JPG, PNG, WebP.*建議尺寸/)).toBeInTheDocument()
      expect(screen.getByText(/可同時選擇多張圖片/)).toBeInTheDocument()
    })
  })

  test('✅ Edit form shows current image information', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('總覽')).toBeInTheDocument()
    })

    // Go to projects tab
    const projectsTab = screen.getByRole('button', { name: '作品管理' })
    await user.click(projectsTab)
    
    await waitFor(() => {
      expect(screen.getByText('現代簡約別墅')).toBeInTheDocument()
    })

    // Click edit button
    const editButton = screen.getByRole('button', { name: '編輯' })
    await user.click(editButton)
    
    await waitFor(() => {
      // Check that current image info is displayed
      expect(screen.getByText('編輯作品')).toBeInTheDocument()
      expect(screen.getByText('目前圖片:')).toBeInTheDocument()
      expect(screen.getByText('/api/placeholder/800/600')).toBeInTheDocument()
      expect(screen.getByText('目前圖片數量:')).toBeInTheDocument()
      expect(screen.getByText('2 張')).toBeInTheDocument()
    })
  })

  test('✅ Form submission includes image data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        id: 2,
        title: '測試專案',
        description: '測試描述',
        image: '/uploads/projects/123_test.jpg',
        gallery: ['/uploads/gallery/123_gallery1.jpg']
      })
    })

    const user = userEvent.setup()
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('總覽')).toBeInTheDocument()
    })

    // Go to projects tab and open form
    const projectsTab = screen.getByRole('button', { name: '作品管理' })
    await user.click(projectsTab)
    
    const addButton = screen.getByRole('button', { name: '新增作品' })
    await user.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('專案名稱')).toBeInTheDocument()
    })

    // Fill in required fields
    await user.type(screen.getByRole('textbox', { name: /專案名稱/i }), '測試專案')
    await user.type(screen.getByRole('textbox', { name: /專案描述/i }), '測試描述')
    await user.type(screen.getByRole('textbox', { name: /完工日期/i }), '2024年12月')
    await user.selectOptions(screen.getByRole('combobox'), '住宅')

    // Create mock files for testing
    const imageFile = new File(['image content'], 'test-image.jpg', { type: 'image/jpeg' })
    const galleryFile = new File(['gallery content'], 'gallery-image.jpg', { type: 'image/jpeg' })

    // Upload files (simulate file selection)
    const imageInput = screen.getByLabelText('主要圖片')
    const galleryInput = screen.getByLabelText('作品圖片集 (可選擇多張)')
    
    await user.upload(imageInput, imageFile)
    await user.upload(galleryInput, galleryFile)

    // Submit form
    const submitButton = screen.getByRole('button', { name: '新增作品' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/projects', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('uploads/projects')
      }))
    })
  })

  test('✅ File input validation works', async () => {
    const user = userEvent.setup()
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('總覽')).toBeInTheDocument()
    })

    // Go to projects tab and open form
    const projectsTab = screen.getByRole('button', { name: '作品管理' })
    await user.click(projectsTab)
    
    const addButton = screen.getByRole('button', { name: '新增作品' })
    await user.click(addButton)
    
    await waitFor(() => {
      const imageInput = screen.getByLabelText('主要圖片')
      const galleryInput = screen.getByLabelText('作品圖片集 (可選擇多張)')
      
      // Check file input attributes for validation
      expect(imageInput).toHaveAttribute('accept', 'image/*')
      expect(galleryInput).toHaveAttribute('accept', 'image/*')
      expect(galleryInput).toHaveAttribute('multiple')
    })
  })
})