import { join } from 'path'

import { Scenes } from 'telegraf'

import { QRCodeReader } from '../helpers/QRCodeReader'
import { downloadFile, deleteFile } from '../helpers/fileManager'
import { getCertInfo, Certificate } from '../helpers/getCertInfo'
import { BotContext } from '../index'

export const checkQRCode = new Scenes.BaseScene<BotContext>('checkQRCode')

checkQRCode.enter(async (ctx) => {
	if (ctx?.message && 'photo' in ctx.message) {
		const { file_id: fileId } = ctx.message.photo[ctx.message.photo.length - 1]

		try {
			const fileUrl = await ctx.telegram.getFileLink(fileId)

			const tempImgPath = await downloadFile(fileUrl.href)

			const textImage = await QRCodeReader(tempImgPath)

			await deleteFile(tempImgPath)

			if (!textImage) {
				return await ctx.reply('Изображение не содержит информацию')
			}

			const matchCorrectUrl = textImage.match(/gosuslugi.ru/g)

			if (!matchCorrectUrl) {
				return await ctx.reply(`QR код не подходит.\nСодержимое QR кода: ${textImage}`)
			}
			const idCertificate = textImage.substr(textImage.lastIndexOf('/') + 1)

			const certificateData: Certificate | undefined = await getCertInfo(idCertificate)

			if (!certificateData) {
				return await ctx.replyWithPhoto(
					{ source: join(__dirname, '../images/bad.png') },
					{
						caption: 'Сертификат не валидный',
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: 'Ссылка на сайт Госуслуги',
										url: textImage,
									},
								],
							],
						},
					},
				)
			}

			return await ctx.replyWithPhoto(
				{ source: join(__dirname, '../images/valid.png') },
				{
					caption: `Имя: ${certificateData.fio}\nДата рождения: ${certificateData.birthdate}\nПаспорт: ${certificateData.doc}`,
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: 'Ссылка на сайт Госуслуги',
									url: textImage,
								},
							],
						],
					},
				},
			)
		} catch (err) {
			if (err instanceof Error) {
				return await ctx.reply(`Ошибка. ${err.message}`)
			}
			await ctx.reply(`Ошибка загрузки, попробуйте еще раз.`)
		}
	}
})
