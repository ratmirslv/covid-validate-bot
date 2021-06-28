import { createWriteStream, unlink } from 'fs'
import { resolve } from 'path'
import { promisify } from 'util'

import fetch from 'node-fetch'

export const downloadFile = async (fileUrl: string): Promise<string> => {
	const pathNewFile = resolve(__dirname, `./${Date.now()}.jpg`)
	const stream = createWriteStream(pathNewFile)

	return fetch(fileUrl).then((response) => {
		if (!response.ok) {
			throw new Error(`Error download image`)
		}
		response.body.pipe(stream)

		return new Promise((resolve, reject) => {
			response.body.on('end', () => resolve(pathNewFile))
			response.body.on('error', (err) => reject(err))
		})
	})
}

export const deleteFile = (filePath: string): Promise<void> => promisify(unlink)(filePath)
