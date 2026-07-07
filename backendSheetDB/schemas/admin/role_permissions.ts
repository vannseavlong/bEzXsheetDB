import { defineTable, string } from 'longcelot-sheet-db';

// One row per role↔module↔action grant.
export default defineTable({
  name: 'role_permissions',
  actor: 'admin',
  timestamps: true,
  columns: {
    role_id: string().required().ref('roles._id'),
    module_id: string().required().ref('modules._id'),
    action_id: string().required().ref('actions._id'),
  },
});
