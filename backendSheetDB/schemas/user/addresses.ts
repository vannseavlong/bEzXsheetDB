import { defineTable, string, number, boolean } from 'longcelot-sheet-db'

export default defineTable({
  name: 'addresses',
  actor: 'user',
  timestamps: true,
  softDelete: true,
  columns: {
    user_id: string().required().ref('customers._id'),
    label: string(),
    address: string().required(),
    address_detail: string(),
    floor_num: string(),
    room_num: string(),
    note: string(),
    latitude: number().required(),
    longitude: number().required(),
    is_primary: boolean().default(false),
    sort: number().default(0),
  },
})
