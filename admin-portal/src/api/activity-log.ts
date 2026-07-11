import { createResourceHooks, type ListParams } from './createResourceHooks'
import type { ActivityLog } from '@/types'

const BASE = '/admin/activity-log'
const resource = createResourceHooks<ActivityLog, never, ActivityLog>('activity-log', BASE)

export const useActivityLogs = (params?: ListParams) => resource.useList(params)
