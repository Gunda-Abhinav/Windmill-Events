# Email Configuration Summary

## ✅ Current Setup

### Email Flow
```
User submits enquiry
    ↓
Backend saves to database
    ↓
Renders HTML email with Nunjucks template
    ↓
Adds to email_queue table (with recipient from .env)
    ↓
Email worker picks up job
    ↓
Authenticates with: GMAIL_USER
    ↓
Sends email FROM: EMAIL_FROM
    ↓
Delivers TO: recipient from database (or ADMIN_TO as fallback)
```

### Configuration (.env)

```bash
# Database
DATABASE_URL=postgresql://...

# Server Ports
PORT=4000
NEXT_PORT=3000

# Email Recipients (saved to database when enquiry is created)
ADMIN_TO=your-email@gmail.com

# Gmail SMTP Authentication
GMAIL_USER=contact@windmill-events.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# Email Sender (Display)
EMAIL_FROM=no-reply@windmill-events.com
GMAIL_FROM_NAME=Windmill Events
```

### How It Works

1. **Authentication:** Uses `GMAIL_USER` credentials to authenticate with Gmail SMTP
2. **Sender Display:** Emails appear to come from `"GMAIL_FROM_NAME" <EMAIL_FROM>`
3. **Recipient:** Stored in database when enquiry is created (from `ADMIN_TO`)
4. **Worker Priority:** Uses database recipient first, falls back to `ADMIN_TO` if missing
5. **Reply-To:** Automatically set to customer's email for easy replies

### Email Headers Example

```
From: Windmill Events <no-reply@windmill-events.com>
To: your-email@gmail.com
Reply-To: customer@example.com
Subject: New Enquiry from [Customer Name]
```

## 🎯 Key Benefits

✅ **Authenticate with one account** (GMAIL_USER)
✅ **Send from a different address** (EMAIL_FROM)
✅ **Professional branding** (GMAIL_FROM_NAME)
✅ **Easy replies** (Reply-To set to customer email)
✅ **Database-driven recipients** (Recipient stored when enquiry created)
✅ **Flexible override** (ADMIN_TO as fallback)

## 🚀 Running the System

### Start Backend
```bash
cd backend
npm run dev
```

### Start Email Worker
```bash
cd backend
npm run email:worker
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## 📧 Test the System

1. Go to: http://localhost:3000/contact
2. Fill out the contact form
3. Submit the enquiry
4. Check email worker logs - you should see:
   ```
   Sending email: to=your-email@gmail.com, subject="New Enquiry from [Name]"
   ✅ Email sent successfully
   ```
5. Check your inbox (email specified in ADMIN_TO)

## 🎨 Email Template

The email uses a beautiful Nunjucks template located at:
`backend/templates/emails/enquiry-notification.html`

Features:
- Professional gradient header
- Responsive design
- Clean typography
- Reply button
- Auto-formatted phone numbers and dates

## 🔧 Customization

### Change Recipient
Update `ADMIN_TO` in `.env`

### Change Sender Display
Update `EMAIL_FROM` and `GMAIL_FROM_NAME` in `.env`

### Change Authentication Account
Update `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env`

### Customize Email Design
Edit `backend/templates/emails/enquiry-notification.html`

## ✨ Summary

**Authentication:** GMAIL_USER (with GMAIL_APP_PASSWORD)
**Sender:** EMAIL_FROM (displayed as GMAIL_FROM_NAME)
**Recipient:** Stored in database from ADMIN_TO (with fallback to ADMIN_TO)
**Template:** Nunjucks (Jinja2-like) HTML templates
**Worker:** email_worker_simple.js

**Status:** ✅ Fully operational and ready to use!

