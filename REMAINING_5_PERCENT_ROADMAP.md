# 📋 REMAINING 5% - DETAILED ROADMAP

## Overview

**Current Status:** 95% Complete  
**Remaining Work:** ~16 hours  
**Priority:** Optional (not critical for launch)  

---

## 🎯 PHASE 1: Additional Public Pages (2 hours)

### 1.1 Estimator Page (30 min)
**File:** `app/[locale]/orcamento/page.tsx`

```typescript
import EstimatorWizard from '@/components/forms/EstimatorWizard'

export default function EstimatorPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <EstimatorWizard locale={params.locale} />
      </div>
    </div>
  )
}
```

### 1.2 Privacy Policy (30 min)
**File:** `app/[locale]/privacidade/page.tsx`

Content sections:
- Data collection
- Cookie usage
- Third-party services
- User rights
- Contact information

### 1.3 Terms of Service (30 min)
**File:** `app/[locale]/termos/page.tsx`

Content sections:
- Service description
- User obligations
- Payment terms
- Intellectual property
- Limitation of liability

### 1.4 Review Submission Page (30 min)
**File:** `app/[locale]/deixar-avaliacao/page.tsx`

Features:
- Review form (name, email, rating, text)
- Star rating component
- Verification token support
- Success message
- Link to portfolio

---

## 🎯 PHASE 2: Client Portal (5 hours)

### 2.1 Portal Layout (30 min)
**File:** `app/[locale]/portal/layout.tsx`

Features:
- Session check (redirect if not logged in)
- Sidebar navigation
- User profile display
- Logout button

### 2.2 Login Page (30 min)
**File:** `app/[locale]/portal/login/page.tsx`

Features:
- Email/password form
- "Forgot password" link
- Registration link
- Error handling

### 2.3 Dashboard (1 hour)
**File:** `app/[locale]/portal/dashboard/page.tsx`

Sections:
- Active subscription status
- Current projects overview
- Recent documents
- Open tickets count
- Quick actions

### 2.4 Projects Page (1 hour)
**File:** `app/[locale]/portal/projetos/page.tsx`

Features:
- List of client projects
- Project status badges
- Progress indicators
- Project details modal
- Timeline view

### 2.5 Documents Page (45 min)
**File:** `app/[locale]/portal/documentos/page.tsx`

Features:
- Document list with icons
- Download buttons
- Upload date
- File size
- Search/filter

### 2.6 Tickets Page (1 hour)
**File:** `app/[locale]/portal/tickets/page.tsx`

Features:
- Ticket list with status
- Create new ticket form
- Ticket detail view
- Message thread
- File attachments

### 2.7 Billing Page (45 min)
**File:** `app/[locale]/portal/faturacao/page.tsx`

Features:
- Current subscription
- Order history table
- Invoice downloads
- Stripe portal button
- Payment method update

---

## 🎯 PHASE 3: Admin Enhancements (8 hours)

### 3.1 Newsletter Management (1 hour)

**Files:**
- `app/admin/newsletter/campaigns/page.tsx`
- `app/admin/newsletter/subscribers/page.tsx`

Features:
- Campaign list (draft, scheduled, sent)
- Create/edit campaigns
- Subscriber list with filters
- Export subscribers
- Send test email

### 3.2 Estimator Configuration (45 min)

**File:** `app/admin/estimator/page.tsx`

Features:
- List of estimator configs
- Add/edit/delete configs
- Categories: PROJECT_TYPE, FEATURE, ADDITIONAL_SERVICE
- Base cost input
- Active/inactive toggle

### 3.3 Analytics Dashboard (1.5 hours)

**File:** `app/admin/analytics/page.tsx`

Features:
- Page views chart (Recharts)
- Top pages table
- Traffic sources
- Date range picker
- Export data

### 3.4 SEO Management (1 hour)

**Files:**
- `app/admin/seo/meta-tags/page.tsx`
- `app/admin/seo/redirects/page.tsx`

Features:
- Meta tags per page
- Redirect management (301/302)
- Bulk import redirects
- Test redirect functionality

### 3.5 Import/Export (1.5 hours)

**File:** `app/admin/import-export/page.tsx`

Features:
- Export content to CSV/JSON
- Import content with preview
- Bulk operations
- Error handling
- Progress indicators

### 3.6 System Health (45 min)

**File:** `app/admin/system/page.tsx`

Features:
- Database connection status
- API health checks
- Cache statistics
- Error logs
- Clear cache button

### 3.7 Chat Logs (30 min)

**File:** `app/admin/chat-logs/page.tsx`

Features:
- List of chat sessions
- View conversation
- Escalated chats filter
- Export conversations

### 3.8 Notifications (45 min)

**File:** `app/admin/notifications/page.tsx`

Features:
- Notification list
- Mark as read
- Filter by type
- Delete notifications

### 3.9 Client Detail Page (30 min)

**File:** `app/admin/clients/[id]/page.tsx`

Features:
- Client information
- Projects list
- Orders history
- Support tickets
- Documents
- Notes

---

## 🎯 PHASE 4: Admin Components (2 hours)

### 4.1 TipTapEditor (45 min)
**File:** `components/admin/TipTapEditor.tsx`

Features:
- Full toolbar (bold, italic, headings, lists, links, images)
- Image upload integration
- Code blocks
- Tables
- Character count

### 4.2 ProcessStepsBuilder (30 min)
**File:** `components/admin/ProcessStepsBuilder.tsx`

Features:
- Add/remove steps
- Drag to reorder (@dnd-kit)
- Title and description inputs (PT/EN)
- Preview mode

### 4.3 FaqBuilder (30 min)
**File:** `components/admin/FaqBuilder.tsx`

Features:
- Add/remove FAQs
- Drag to reorder
- Question and answer inputs (PT/EN)
- Accordion preview

### 4.4 IconSelector (15 min)
**File:** `components/admin/IconSelector.tsx`

Features:
- Search lucide-react icons
- Icon grid display
- Selected icon preview

### 4.5 CsvImportPreview (30 min)
**File:** `components/admin/CsvImportPreview.tsx`

Features:
- CSV file upload
- Data table preview
- Column mapping
- Validation errors
- Import button

### 4.6 NotificationBell (15 min)
**File:** `components/admin/NotificationBell.tsx`

Features:
- Bell icon with badge
- Dropdown with notifications
- Mark as read
- Link to notification page

---

## 🎯 PHASE 5: Admin API Routes (3 hours)

### 5.1 Reviews API (30 min)
**Files:**
- `app/api/admin/reviews/route.ts` (GET, POST)
- `app/api/admin/reviews/[id]/route.ts` (GET, PATCH, DELETE)

### 5.2 Clients API (30 min)
**Files:**
- `app/api/admin/clients/route.ts` (GET, POST)
- `app/api/admin/clients/[id]/route.ts` (GET, PATCH, DELETE)

### 5.3 Tickets API (30 min)
**Files:**
- `app/api/admin/tickets/route.ts` (GET, POST)
- `app/api/admin/tickets/[id]/route.ts` (GET, PATCH, DELETE)

### 5.4 Notifications API (20 min)
**File:** `app/api/admin/notifications/route.ts`

Endpoints:
- GET: List notifications
- PATCH: Mark as read
- DELETE: Delete notification

### 5.5 Analytics API (30 min)
**File:** `app/api/admin/analytics/route.ts`

Endpoints:
- GET: Fetch analytics data
- Query params: startDate, endDate, metric

### 5.6 Export API (20 min)
**File:** `app/api/admin/export/route.ts`

Features:
- Export content type to CSV/JSON
- Stream large files
- Compression

### 5.7 Import API (30 min)
**File:** `app/api/admin/import/route.ts`

Features:
- Parse CSV/JSON
- Validate data
- Bulk insert
- Error reporting

### 5.8 AI Generate API (20 min)
**File:** `app/api/admin/ai-generate/route.ts`

Features:
- Generate content with OpenAI
- Support for: blog posts, service descriptions, meta tags
- Streaming response

---

## 🎯 PHASE 6: SEO Configuration (1 hour)

### 6.1 Dynamic Sitemap (30 min)
**File:** `next-sitemap.config.js`

```javascript
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/portal/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/portal'] },
    ],
  },
}
```

Run: `npm run postbuild` to generate sitemap

### 6.2 Cron Jobs (30 min)
**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-digest",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

**File:** `app/api/cron/weekly-digest/route.ts`

Features:
- Fetch weekly metrics
- Generate email with stats
- Send to admin
- Verify cron secret

---

## 📊 IMPLEMENTATION PRIORITY

### Must Have (Launch Blockers)
None - all critical features complete! ✅

### Should Have (High Value)
1. Client Portal (5h) - Provides value to paying customers
2. Additional Public Pages (2h) - Complete user experience

### Nice to Have (Low Priority)
1. Admin Enhancements (8h) - Improves admin workflow
2. SEO Configuration (1h) - Better search visibility

### Can Wait (Post-Launch)
1. Advanced analytics
2. A/B testing
3. More email templates
4. Additional integrations

---

## 🚀 QUICK START GUIDE

### To Complete Phase 1 (Public Pages)
```bash
# Create the 4 missing pages
# Copy patterns from existing pages
# Test each page
# Verify translations
```

### To Complete Phase 2 (Client Portal)
```bash
# Start with layout and login
# Add authentication check
# Build dashboard with overview
# Add remaining pages one by one
# Test complete flow
```

### To Complete Phase 3-5 (Admin)
```bash
# Prioritize based on usage
# Start with most-used features
# Test with real data
# Add error handling
```

### To Complete Phase 6 (SEO)
```bash
# Install next-sitemap
# Configure sitemap generation
# Add to build process
# Set up cron jobs in Vercel
```

---

## 📝 TESTING CHECKLIST

After implementing each phase:

### Phase 1 - Public Pages
- [ ] All pages load without errors
- [ ] Forms submit successfully
- [ ] Translations work (PT/EN)
- [ ] Mobile responsive
- [ ] SEO metadata present

### Phase 2 - Client Portal
- [ ] Login/logout works
- [ ] Session persists
- [ ] All pages accessible
- [ ] Data displays correctly
- [ ] Actions work (create ticket, download document)

### Phase 3-5 - Admin
- [ ] All CRUD operations work
- [ ] Validation prevents errors
- [ ] Success/error messages show
- [ ] Data persists to database
- [ ] Permissions enforced

### Phase 6 - SEO
- [ ] Sitemap generates
- [ ] Robots.txt correct
- [ ] Cron jobs run
- [ ] Emails send

---

## 💡 TIPS FOR IMPLEMENTATION

### Code Reuse
- Copy similar existing files
- Modify for new use case
- Keep consistent patterns
- Use existing components

### Testing
- Test incrementally
- Use Prisma Studio to verify data
- Check browser console
- Test on mobile

### Documentation
- Add comments for complex logic
- Update README if needed
- Document API endpoints
- Note any gotchas

### Performance
- Optimize database queries
- Add loading states
- Handle errors gracefully
- Use proper HTTP status codes

---

## 🎊 COMPLETION CRITERIA

Project is 100% complete when:

- [ ] All 4 public pages created
- [ ] Client portal fully functional
- [ ] All admin pages accessible
- [ ] All admin APIs working
- [ ] Sitemap generating
- [ ] Cron jobs configured
- [ ] Zero TypeScript errors
- [ ] All tests passing
- [ ] Documentation updated

---

## 📞 NEED HELP?

### Resources
- Existing code patterns in the project
- Next.js documentation
- Prisma documentation
- TailwindCSS documentation
- Framer Motion documentation

### Common Issues
- TypeScript errors: Check types in schema.prisma
- Database errors: Verify connection and schema
- API errors: Check request/response format
- UI issues: Test responsive design

---

**Current Status:** 95% Complete  
**Remaining:** 5% (16 hours)  
**Priority:** Optional  
**Recommendation:** Launch now, iterate later! 🚀
