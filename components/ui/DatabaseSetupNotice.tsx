'use client'

import { AlertTriangle, Database, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DatabaseSetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-brand-teal/5 px-4 py-12">
      <Card className="w-full max-w-2xl border-yellow-500/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Database Setup Required</CardTitle>
              <CardDescription>
                The application needs a PostgreSQL database to function
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              This application requires a PostgreSQL database connection. Please set up your database to continue.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Database className="h-5 w-5 text-brand-teal" />
              Quick Setup (5 minutes)
            </h3>
            
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-medium">Option 1: Free Cloud Database (Recommended)</p>
              <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                <li>Go to <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">neon.tech</a> and sign up (free, no credit card)</li>
                <li>Create a new project named "tecfazer"</li>
                <li>Copy the connection string provided</li>
                <li>Update <code className="rounded bg-muted px-1 py-0.5">.env.local</code> with your connection string</li>
                <li>Run: <code className="rounded bg-muted px-1 py-0.5">npx prisma db push && npx prisma db seed</code></li>
                <li>Restart the development server</li>
              </ol>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href="https://neon.tech" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Neon.tech
                </a>
              </Button>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-medium">Option 2: Local PostgreSQL</p>
              <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
                <li>Install PostgreSQL from <a href="https://www.postgresql.org/download/" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">postgresql.org</a></li>
                <li>Create a database named "tecfazer"</li>
                <li>Update <code className="rounded bg-muted px-1 py-0.5">.env.local</code> with your local connection</li>
                <li>Run: <code className="rounded bg-muted px-1 py-0.5">npx prisma db push && npx prisma db seed</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>

          <div className="rounded-lg bg-blue-500/10 p-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              📚 Need detailed instructions?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check the <code className="rounded bg-muted px-1 py-0.5">QUICK_DATABASE_SETUP.md</code> file in your project root for step-by-step instructions.
            </p>
          </div>

          <div className="rounded-lg border-l-4 border-brand-teal bg-brand-teal/5 p-4">
            <p className="text-sm font-medium">What you'll get after setup:</p>
            <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-muted-foreground">
              <li>1 Admin user (admin@tecfazer.pt / TecFazer2024Admin)</li>
              <li>6 Team members with profiles</li>
              <li>35+ Services across all categories</li>
              <li>4 Pricing plans</li>
              <li>8 Customer testimonials</li>
              <li>Fully functional admin dashboard</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
