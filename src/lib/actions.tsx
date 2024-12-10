'use server'

import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function uploadAudio(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file uploaded')
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Save the file
  const path = join(process.cwd(), 'public', 'uploads', file.name)
  await writeFile(path, buffer)

  return { success: true, path: `/uploads/${file.name}` }
}

