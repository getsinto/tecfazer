'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import DeleteDialog from '@/components/admin/DeleteDialog'
import { formatDate } from '@/lib/utils'

interface BlogPost {
  id: string
  slug: string
  titlePt: string
  titleEn: string
  excerptPt: string
  categories: string[]
  tags: string[]
  isPublished: boolean
  publishedAt: Date | null
  author: {
    name: string
  }
}

interface BlogClientProps {
  posts: BlogPost[]
}

export default function BlogClient({ posts }: BlogClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase()
    return (
      post.titlePt.toLowerCase().includes(query) ||
      post.titleEn.toLowerCase().includes(query) ||
      post.excerptPt.toLowerCase().includes(query) ||
      post.categories.some((cat) => cat.toLowerCase().includes(query)) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      post.author.name.toLowerCase().includes(query)
    )
  })

  const openDeleteDialog = (post: BlogPost) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      const response = await fetch(`/api/admin/blog/${postToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Blog post deleted successfully')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete blog post')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      })

      if (response.ok) {
        toast.success(
          post.isPublished ? 'Blog post unpublished' : 'Blog post published'
        )
        router.refresh()
      } else {
        toast.error('Failed to update blog post')
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
          placeholder="Search blog posts by title, category, tag, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Blog posts list */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? 'No blog posts found matching your search' : 'No blog posts yet'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{post.titlePt}</h3>
                  {!post.isPublished && (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                  {post.isPublished && (
                    <Badge variant="default">Published</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.excerptPt}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  By {post.author.name}
                  {post.publishedAt && ` • ${formatDate(post.publishedAt)}`}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/content/blog/${post.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePublished(post)}
                  title={post.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {post.isPublished ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(post)}
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
        title="Delete Blog Post?"
        description="This will permanently delete this blog post and all its comments. This action cannot be undone."
        itemName={postToDelete?.titlePt || ''}
      />
    </>
  )
}
