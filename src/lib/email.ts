import nodemailer from 'nodemailer'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  projectType?: string
  budget?: string
  message: string
  submittedAt: string
  status: 'new' | 'read' | 'replied'
}

// Create Gmail transporter
function createTransporter() {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  })
}

// Send notification to admin when new contact form is submitted
export async function sendContactNotification(submission: ContactSubmission) {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `新的聯絡表單 - ${submission.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300;">${process.env.COMPANY_NAME || '向上建設'}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">新的聯絡表單提交</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #495057; font-size: 18px; margin-bottom: 20px;">聯絡人資訊</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #6c757d; width: 120px;">姓名：</td>
                <td style="padding: 8px 0; color: #495057;">${submission.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">電子信箱：</td>
                <td style="padding: 8px 0; color: #495057;">
                  <a href="mailto:${submission.email}" style="color: #007bff; text-decoration: none;">
                    ${submission.email}
                  </a>
                </td>
              </tr>
              ${submission.phone ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">電話：</td>
                <td style="padding: 8px 0; color: #495057;">${submission.phone}</td>
              </tr>
              ` : ''}
              ${submission.projectType ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">項目類型：</td>
                <td style="padding: 8px 0; color: #495057;">${submission.projectType}</td>
              </tr>
              ` : ''}
              ${submission.budget ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">預算範圍：</td>
                <td style="padding: 8px 0; color: #495057;">${submission.budget}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">提交時間：</td>
                <td style="padding: 8px 0; color: #495057;">${new Date(submission.submittedAt).toLocaleString('zh-TW')}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px;">
              <h3 style="color: #495057; font-size: 16px; margin-bottom: 10px;">詳細需求</h3>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                ${submission.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <a href="${process.env.COMPANY_WEBSITE || 'http://localhost:3003'}/admin" 
                 style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block;">
                前往管理後台
              </a>
              <p style="margin-top: 15px; color: #6c757d; font-size: 14px;">
                您可以在管理後台中查看所有聯絡表單並回覆客戶。
              </p>
            </div>
          </div>
        </div>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Contact notification sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send contact notification:', error)
    return { success: false, error: error.message }
  }
}

// Send confirmation email to the user
export async function sendContactConfirmation(submission: ContactSubmission) {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: submission.email,
      subject: `感謝您的聯絡 - ${process.env.COMPANY_NAME || '向上建設'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300;">${process.env.COMPANY_NAME || '向上建設'}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">感謝您的聯絡</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #495057; font-size: 18px; margin-bottom: 20px;">親愛的 ${submission.name}，</h2>
            
            <p style="color: #495057; line-height: 1.6; margin-bottom: 20px;">
              感謝您對我們建築設計服務的關注。我們已經收到您的聯絡表單，我們的專業團隊將在 <strong>24小時內</strong> 回覆您的詢問。
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
              <h3 style="color: #495057; font-size: 16px; margin-bottom: 15px;">您提交的資訊摘要</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${submission.projectType ? `
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #6c757d; width: 100px;">項目類型：</td>
                  <td style="padding: 5px 0; color: #495057;">${submission.projectType}</td>
                </tr>
                ` : ''}
                ${submission.budget ? `
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #6c757d;">預算範圍：</td>
                  <td style="padding: 5px 0; color: #495057;">${submission.budget}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #6c757d;">提交時間：</td>
                  <td style="padding: 5px 0; color: #495057;">${new Date(submission.submittedAt).toLocaleString('zh-TW')}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #0056b3; font-size: 16px; margin-bottom: 10px;">接下來的步驟</h3>
              <ul style="color: #495057; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>我們的設計顧問將詳細審閱您的需求</li>
                <li>安排適合的時間進行進一步討論</li>
                <li>提供初步的設計建議和報價</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">
                如有緊急事項，請直接撥打我們的服務專線：<strong>(02) 2xxx-xxxx</strong>
              </p>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 14px;">
                ${process.env.COMPANY_NAME || '向上建設'} 團隊敬上
              </p>
            </div>
          </div>
        </div>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Contact confirmation sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send contact confirmation:', error)
    return { success: false, error: error.message }
  }
}

// Send custom reply from admin
export async function sendCustomReply(to: string, subject: string, message: string, replyTo?: string) {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      replyTo: replyTo || process.env.GMAIL_USER,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 300;">${process.env.COMPANY_NAME || '向上建設'}</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 20px; border-radius: 5px; color: #495057; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">
                ${process.env.COMPANY_NAME || '向上建設'} 團隊
              </p>
            </div>
          </div>
        </div>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Custom reply sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send custom reply:', error)
    return { success: false, error: error.message }
  }
}