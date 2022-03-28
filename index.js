const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, tryAgainOptions} = require('./options')
const token = '5075889070:AAG_c0ZEbrSm_4q6qPHzDJoOocwR0C32gPQ';

const bot = new TelegramApi(token, {polling: true});

const chats = {}


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9 а ты отгадаешь')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  return bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {
      command: '/start',
      description: 'Приветствие'
    },
    {
      command: '/info',
      description: 'Получить информацию о пользователе'
    },
    {
      command: '/game',
      description: 'Игра с отгадыванием числа'
    }
  ])

  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    const nickname = msg.chat.first_name
    if (text === '/start') {
      return bot.sendMessage(chatId, `Привет ${nickname}`)
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, `Я тебя не понимаю`)
  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    if (+data === chats[chatId]) {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/192/27.webp')
      return bot.sendMessage(chatId, `Ты выиграл`, tryAgainOptions)
    } else {
      return bot.sendMessage(chatId, `Ты выбрал неверную цифру ${chats[chatId]}`, tryAgainOptions)
    }
  })
}

start();
