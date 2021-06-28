import { Scenes } from 'telegraf'

import { downloadFile, deleteFile } from '../helpers/fileManager'
import { BotContext } from '../index'

export const checkQRCode = new Scenes.BaseScene<BotContext>('checkQRCode')

checkQRCode.enter(async (ctx) => {
	if (ctx?.message && 'photo' in ctx.message) {
		const { file_id: fileId } = ctx.message.photo[ctx.message.photo.length - 1]

		try {
			const fileUrl = await ctx.telegram.getFileLink(fileId)
			const tempImgPath = await downloadFile(fileUrl.href)

			await deleteFile(tempImgPath)

			await ctx.reply(tempImgPath)
		} catch (err) {
			await ctx.reply(`Ошибка загрузки, попробуйте еще раз`)
		}
	}
})
