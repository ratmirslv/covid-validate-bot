import 'dotenv-safe/config'
import { Telegraf, Scenes, session } from 'telegraf'

import * as commands from './commands'
import { checkQRCode } from './scenes/checkQRCode'

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError('BOT_TOKEN must be provided!')
}

export type BotContext = Scenes.SceneContext

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN)

const stage = new Scenes.Stage([checkQRCode])

//TODO: https://github.com/telegraf/telegraf/issues/1372
bot.use(session())

bot.use(stage.middleware())

async function main() {
	bot.start(commands.help)

	bot.help(commands.help)

	bot.on('photo', (ctx) => ctx.scene.enter('checkQRCode'))
	await bot.launch()
}
main().catch((err) => {
	throw err
})

process.on('unhandledRejection', (err) => {
	throw err
})
