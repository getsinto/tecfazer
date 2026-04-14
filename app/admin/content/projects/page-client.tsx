'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Search, Star } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import DeleteDialog from '@/components/admin/DeleteDialog'

interface Project {
  id: string
  slug: string
  title: string
  categories: string[]
  technologies: string[]
  clientCountry: string
  isFeatured: boolean
  isCaseStudy: boolean
}

interface ProjectsClientProps {
  projects: Project[]
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase()
    return (
      project.title.toLowerCase().includes(query) ||
      project.clientCountry.toLowerCase().includes(query) ||
      project.categories.some((cat) => cat.toLowerCase().includes(query)) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(query))
    )
  })

  const openDeleteDialog = (project: Project) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!projectToDelete) return

    try {
      const response = await fetch(`/api/admin/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Project deleted successfully')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete project')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const toggleFeatured = async (project: Project) => {
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !project.isFeatured }),
      })

      if (response.ok) {
        toast.success(
          project.isFeatured
            ? 'Removed from featured'
            : 'Added to featured'
        )
        router.refresh()
      } else {
        toast.error('Failed to update project')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  return (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects by title, category, technology, or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects list */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No projects found matching your search' : 'No projects yet'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{project.title}</h3>
                  {project.isFeatured && (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </Badge>
                  )}
                  {project.isCaseStudy && (
                    <Badge variant="secondary">Case Study</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.clientCountry}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {project.technologies.slice(0, 5).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.technologies.length - 5}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/content/projects/${project.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFeatured(project)}
                  title={project.isFeatured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star
                    className={`h-4 w-4 ${
                      project.isFeatured ? 'fill-yellow-400 text-yellow-400' : ''
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(project)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Project?"
        description="This will permanently delete this project. This action cannot be undone."
        itemName={projectToDelete?.title || ''}
      />
    </>
  )
}
