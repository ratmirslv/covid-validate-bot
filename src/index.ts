import 'dotenv-safe/config'
import { Telegraf, Scenes } from 'telegraf'

import * as commands from './commands'

if (process.env.BOT_TOKEN === undefined) {
	throw new TypeError('BOT_TOKEN must be provided!')
}

export type BotContext = Scenes.SceneContext

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN)

async function main() {
	bot.start(commands.help)

	bot.help(commands.help)

	await bot.launch()
}
main().catch((err) => {
	throw err
})
