import { BotContext } from '../index'

const helpText = (userName = 'друг') =>
	`Привет, ${userName}! Я - бот для проверки вакцинации по QR коду.
Пришли мне фотографию QR кода, и я отвечу - валидный ли электронный сертификат.`

export function help(ctx: BotContext): Promise<unknown> {
	return ctx.reply(helpText(ctx.message?.from.first_name))
}
