import { Router } from 'express'
import multer from 'multer'
import type { SheetAdapter } from 'longcelot-sheet-db'

const upload = multer({ storage: multer.memoryStorage() })

// Always backed by Drive (via a Sheets-authenticated client), independent of DB_DRIVER — see
// config/adapter.ts's `storage` and the `AppAdapter` doc comment for why.
export function createUploadRouter(storage: SheetAdapter) {
  const router = Router()

  router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file
    if (!file) {
      res.status(400).json({ message: 'No file provided' })
      return
    }

    const url = await storage.upload(file.buffer, {
      filename: file.originalname,
      mimeType: file.mimetype,
      public: true,
    })

    res.json({ message: 'File uploaded successfully', url })
  })

  return router
}
