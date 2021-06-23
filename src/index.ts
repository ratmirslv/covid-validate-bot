import 'dotenv-safe/config'
import { Telegraf } from 'telegraf'

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(process.env.BOT_TOKEN)

async function main() {
	bot.start((ctx) => ctx.reply('Welcome'))
	await bot.launch()

	bot.on('text', (ctx) => {
		return ctx.reply('Hey User!')
	})
}
main().catch((err) => {
	throw err
})
