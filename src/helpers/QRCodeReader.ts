import { readFileSync } from 'fs'

import jpeg from 'jpeg-js'
import jsQR from 'jsqr'

export const QRCodeReader = (imgPath: string): Promise<string> | undefined => {
	const imagedata = readFileSync(imgPath)
	const jpgData = jpeg.decode(imagedata, { useTArray: true })
	const qrArray = new Uint8ClampedArray(jpgData.data.buffer)
	const result = jsQR(qrArray, jpgData.width, jpgData.height)

	if (result) {
		return Promise.resolve(result.data)
	}
}
