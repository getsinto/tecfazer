import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import ProjectsClient from './page-client'

export const metadata = {
  title: 'Projects - Admin',
}

async function getProjects() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      clientUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return projects
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  const featuredCount = projects.filter((p) => p.isFeatured).length
  const caseStudyCount = projects.filter((p) => p.isCaseStudy).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/content/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{featuredCount}</div>
            <p className="text-sm text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{caseStudyCount}</div>
            <p className="text-sm text-muted-foreground">Case Studies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.completedAt).length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No projects yet</p>
            <Button asChild className="mt-4">
              <Link href="/admin/content/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ProjectsClient projects={projects} />
      )}
    </div>
  )
}
