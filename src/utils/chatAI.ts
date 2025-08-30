// AI Auto-responses for common questions
export const getAIResponse = (userMessage: string): string | null => {
  const message = userMessage.toLowerCase().trim();

  // How to use the website
  if (message.includes('how') && (message.includes('work') || message.includes('use') || message.includes('start'))) {
    return "Great question! Here's how Dividify works:\n\n1. 📊 **Create Your Company** - Add your company details and shareholders\n2. 📝 **Generate Documents** - Create dividend vouchers and board minutes with our templates\n3. ✅ **HMRC Compliant** - All documents are automatically compliant with UK regulations\n4. 📧 **Download & Send** - Get your documents in PDF or Word format\n\nYou can start with our free trial at any time! Need help with a specific step?";
  }

  // Pricing questions
  if (message.includes('price') || message.includes('cost') || message.includes('plan') || message.includes('payment')) {
    return "Here are our pricing plans:\n\n**Individual Plan - £6/month:**\n• Up to 5 dividend vouchers\n• Up to 3 board minutes\n• All document templates\n• HMRC compliant\n\n**Accountants Plan - £30/month:**\n• Unlimited companies\n• Unlimited documents\n• White-label branding\n• Priority support\n\nBoth plans include a **free trial**! Would you like help choosing the right plan?";
  }

  // Technical support
  if (message.includes('error') || message.includes('problem') || message.includes('issue') || message.includes('bug')) {
    return "I'm sorry you're experiencing an issue! For technical problems, our support team can help you directly.\n\nCommon solutions:\n• Try refreshing your browser\n• Clear your browser cache\n• Check your internet connection\n\nIf the problem persists, please describe the exact error message and we'll get back to you within 24 hours with a solution.";
  }

  // Document questions
  if (message.includes('dividend') || message.includes('voucher') || message.includes('board') || message.includes('minutes')) {
    return "Dividify helps you create:\n\n**📄 Dividend Vouchers:**\n• Professional templates\n• Automatic tax calculations\n• HMRC compliant format\n• Multiple shareholders supported\n\n**📋 Board Minutes:**\n• Meeting documentation\n• Dividend declarations\n• Director resolutions\n• Statutory compliance\n\nAll documents are generated instantly and can be downloaded in PDF or Word format. Need help with a specific document type?";
  }

  // HMRC/Compliance questions
  if (message.includes('hmrc') || message.includes('compliance') || message.includes('legal') || message.includes('tax')) {
    return "✅ **HMRC Compliance Guaranteed**\n\nAll Dividify documents are:\n• Compliant with UK company law\n• Follow HMRC guidelines\n• Include required statutory information\n• Professionally formatted\n\nOur templates are regularly updated to ensure ongoing compliance. For specific tax advice, we recommend consulting your accountant, but our documents provide the proper foundation for your filings.";
  }

  // Account/Login questions
  if (message.includes('account') || message.includes('login') || message.includes('password') || message.includes('sign')) {
    return "**Account Help:**\n\n• **Forgot password?** Use the 'Reset Password' link on the login page\n• **Can't log in?** Check your email for verification links\n• **Free trial?** Sign up with just your email - no credit card required\n• **Multiple companies?** Our Accountants plan supports unlimited companies\n\nNeed specific account assistance? I'll connect you with our support team!";
  }

  // General greeting/help
  if (message.includes('hello') || message.includes('hi') || message.includes('help') || message.length < 10) {
    return "Hello! 👋 I'm here to help you with Dividify!\n\nI can assist with:\n• 🚀 Getting started\n• 💰 Pricing questions\n• 📄 Document creation\n• ⚖️ HMRC compliance\n• 🔧 Technical support\n\nWhat would you like to know about Dividify today?";
  }

  // Default response for unrecognized questions
  return null;
};