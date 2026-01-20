# Email System - Quick Reference

## 🚀 Quick Start

```bash
# 1. Configure .env
ADMIN_TO=notifications@windmill-events.com
GMAIL_USER=no-reply@windmill-events.com
GMAIL_APP_PASSWORD=your-16-char-password

# 2. Test
npm run email:test

# 3. Start worker
npm run email:worker

# 4. Start server
npm run dev
```

## 📧 Email Addresses

| Purpose | Email Address |
|---------|--------------|
| **Sender (From)** | no-reply@windmill-events.com |
| **Recipient (To)** | notifications@windmill-events.com |
| **Reply-To** | Customer's email (automatic) |

## 📁 Key Files

```
backend/
├── lib/
│   ├── gmail-smtp.js           # Gmail SMTP transport
│   ├── email-templates.js      # Nunjucks renderer
│   └── email-service.js        # High-level functions
├── templates/emails/
│   └── enquiry-notification.html  # Email template
├── email_worker_simple.js      # Background worker
└── server.js                   # Enqueues emails
```

## 🔧 Common Tasks

### Test Email System
```bash
npm run email:test
```

### Start Email Worker
```bash
npm run email:worker
```

### Check Email Queue
```bash
node -e "require('dotenv').config(); const {Pool}=require('pg'); const p=new Pool({connectionString:process.env.DATABASE_URL}); p.query('SELECT * FROM email_queue ORDER BY created_at DESC LIMIT 10').then(r=>console.table(r.rows)).finally(()=>p.end())"
```

### Customize Email Template
Edit: `backend/templates/emails/enquiry-notification.html`

### Add New Template
1. Create: `templates/emails/my-template.html`
2. Add renderer: `lib/email-templates.js`
3. Use in code

## 🎨 Template Syntax (Nunjucks)

```html
<!-- Variables -->
<p>Hello {{ name }}!</p>

<!-- Filters -->
<p>Phone: {{ phone | formatPhone }}</p>
<p>Date: {{ eventDate | formatDate }}</p>

<!-- Conditionals -->
{% if phone %}
  <p>Phone: {{ phone }}</p>
{% endif %}

<!-- Loops -->
{% for item in items %}
  <li>{{ item }}</li>
{% endfor %}
```

## 🔍 Troubleshooting

### "Invalid login" Error
- Use App Password (not regular password)
- Enable 2-Step Verification on Google Account
- Generate new App Password at: https://myaccount.google.com/apppasswords

### Emails Not Sending
```bash
# Check worker is running
ps aux | grep email_worker

# Check email queue
npm run email:test

# View worker logs
npm run email:worker
```

### Template Not Found
- Verify file exists: `ls templates/emails/`
- Check file name (case-sensitive)
- Restart worker after changes

## 📊 Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
GMAIL_USER=no-reply@windmill-events.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Optional
ADMIN_TO=notifications@windmill-events.com  # Default: GMAIL_USER
GMAIL_FROM_NAME=Windmill Events             # Default: GMAIL_USER
```

## 🎯 Email Flow

```
Form Submit → Validate → Save DB → Render Template → 
Queue Email → Worker Picks Up → Send SMTP → Update Status
```

## 📝 Code Examples

### Send Enquiry Email (Automatic)
```javascript
// In server.js - already implemented
const body = renderEnquiryEmail({
  name: data.name,
  email: data.email,
  phone: data.phone,
  eventType: data.eventType,
  eventDate: data.eventDate,
  message: data.message,
})
```

### Send Custom Email
```javascript
const { sendEmail } = require('./lib/gmail-smtp')

await sendEmail({
  to: 'customer@example.com',
  subject: 'Your Event Confirmation',
  html: '<h1>Thank you!</h1>',
  replyTo: 'support@windmill-events.com'
})
```

### Render Template
```javascript
const { renderEnquiryEmail } = require('./lib/email-templates')

const html = renderEnquiryEmail({
  name: 'John Doe',
  email: 'john@example.com',
  // ... other fields
})
```

## 🔒 Security

- ✅ Auto-escaping in templates (prevents XSS)
- ✅ App Passwords (not main password)
- ✅ Environment variables (not hardcoded)
- ✅ Rate limiting on API endpoints

## 📚 Documentation

- **Full Guide:** `SIMPLIFIED_EMAIL_SUMMARY.md`
- **Detailed Docs:** `README_EMAIL_SYSTEM.md`

---

**Need help?** Check the full documentation or run `npm run email:test`

