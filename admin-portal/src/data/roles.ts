import type { RolesProps } from '@/types'

export const rolesData: RolesProps[] = [
  {
    id: 'role-1',
    role: 'SuperAdmin',
    status: 'Active',
    createdAt: new Date('2025-01-05T09:30:00Z'),
    createdBy: 'Sophia',
  },
  {
    id: 'role-2',
    role: 'Admin',
    status: 'Inactive',
    createdAt: new Date('2025-02-12T14:15:00Z'),
    createdBy: 'Liam',
  },
  {
    id: 'role-3',
    role: 'User',
    status: 'Pending',
    createdAt: new Date('2025-03-01T08:45:00Z'),
    createdBy: 'Mia',
  },
  {
    id: 'role-4',
    role: 'Manager',
    status: 'Active',
    createdAt: new Date('2025-03-20T11:00:00Z'),
    createdBy: 'James',
  },
  {
    id: 'role-5',
    role: 'Viewer',
    status: 'Active',
    createdAt: new Date('2025-04-10T07:30:00Z'),
    createdBy: 'Emma',
  },
]
