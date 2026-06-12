import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'category_category_addons',
  actor: 'admin',
  timestamps: true,
  columns: {
    category_id: string().required().ref('categories._id'),
    addon_id: string().required().ref('category_addons._id'),
    sort: number().default(0),
  },
});
