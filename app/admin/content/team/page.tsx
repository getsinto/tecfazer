import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import TeamClient from './page-client'

export const metadata = {
  title: 'Team - Admin',
}

async function getTeamMembers() {
  const members = await db.teamMember.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return members
}

export default async function AdminTeamPage() {
  const members = await getTeamMembers()

  const activeCount = members.filter((m) => m.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team profiles
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/content/team/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {members.length - activeCount}
            </div>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No team members yet</p>
            <Button asChild className="mt-4">
              <Link href="/admin/content/team/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Team Member
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TeamClient members={members} />
      )}
    </div>
  )
}
