// Debug script to test admin functionality
// Open browser console and run this

console.log('Testing admin panel navigation...');

// Check if we're on the admin page
if (window.location.pathname.includes('/admin')) {
    console.log('✓ On admin page');
    
    // Find tab buttons
    const tabs = document.querySelectorAll('button[class*="pb-4 border-b-2"]');
    console.log('Tab buttons found:', tabs.length);
    
    tabs.forEach((tab, index) => {
        console.log(`Tab ${index}:`, tab.textContent, tab.className);
    });
    
    // Find contact tab specifically
    const contactTab = Array.from(tabs).find(tab => tab.textContent.includes('聯絡訊息'));
    if (contactTab) {
        console.log('✓ Contact tab found:', contactTab);
        
        console.log('Clicking contact tab...');
        contactTab.click();
        
        // Check if contact management appears
        setTimeout(() => {
            const contactManagement = document.querySelector('h1[class*="text-3xl"]');
            if (contactManagement && contactManagement.textContent.includes('聯絡訊息管理')) {
                console.log('✓ Contact management page is showing');
                
                // Check for contact data
                const table = document.querySelector('table');
                if (table) {
                    console.log('✓ Contact table found');
                    const rows = table.querySelectorAll('tbody tr');
                    console.log(`Contact rows: ${rows.length}`);
                    
                    if (rows.length === 0) {
                        const emptyMessage = document.querySelector('p[class*="text-gray-500"]');
                        if (emptyMessage) {
                            console.log('Empty message:', emptyMessage.textContent);
                        }
                    }
                } else {
                    console.log('❌ No contact table found');
                }
            } else {
                console.log('❌ Contact management page is NOT showing');
                console.log('Current page title:', document.querySelector('h1')?.textContent);
            }
        }, 500);
    } else {
        console.log('❌ Contact tab not found');
    }
} else {
    console.log('❌ Not on admin page. Navigate to /admin first');
}