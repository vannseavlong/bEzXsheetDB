import { Router } from 'express'
import multer from 'multer'
import type { SheetAdapter } from 'longcelot-sheet-db'

const upload = multer({ storage: multer.memoryStorage() })

export function createUploadRouter(adapter: SheetAdapter) {
  const router = Router()

  router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file
    if (!file) {
      res.status(400).json({ message: 'No file provided' })
      return
    }

    const url = await adapter.upload(file.buffer, {
      filename: file.originalname,
      mimeType: file.mimetype,
      public: true,
    })

    res.json({ message: 'File uploaded successfully', url })
  })

  return router
}
