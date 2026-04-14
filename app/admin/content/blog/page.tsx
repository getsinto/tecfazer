import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import BlogClient from './page-client'

export const metadata = {
  title: 'Blog - Admin',
}

async function getBlogPosts() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })

  return posts
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts()

  const publishedCount = posts.filter((p) => p.isPublished).length
  const draftCount = posts.filter((p) => !p.isPublished).length
  const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/content/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-sm text-muted-foreground">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No blog posts yet</p>
            <Button asChild className="mt-4">
              <Link href="/admin/content/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                Write Your First Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <BlogClient posts={posts} />
      )}
    </div>
  )
}
