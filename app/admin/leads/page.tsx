'use client'

import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Mail, Phone, Building, Calendar, MessageSquare, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  serviceInterest: string | null
  budgetRange: string | null
  timeline: string | null
  message: string | null
  status: 'NEW' | 'CONTACTED' | 'CLOSED'
  source: string
  createdAt: Date
}

const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'serviceInterest',
    header: 'Service',
    cell: ({ row }) => row.original.serviceInterest || '-',
  },
  {
    accessorKey: 'budgetRange',
    header: 'Budget',
    cell: ({ row }) => row.original.budgetRange || '-',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant={
            status === 'NEW'
              ? 'default'
              : status === 'CONTACTED'
              ? 'secondary'
              : 'outline'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
          <DropdownMenuItem>Mark as Closed</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch leads from API
    // For now, using empty array
    setLeads([])
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Manage and track all incoming leads
          </p>
        </div>
        <Button>Export CSV</Button>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        searchKey="name"
        searchPlaceholder="Search leads..."
      />
    </div>
  )
}
