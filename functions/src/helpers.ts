import axios from 'axios';
import * as logger from 'firebase-functions/logger';
import { config } from 'firebase-functions';

const TELEGRAM_BOT_TOKEN = config().telegram.bot_token;

export async function getTelegramChats(): Promise<any> {
  if (!TELEGRAM_BOT_TOKEN) {
    logger.error('Telegram bot token is not set');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;

  try {
    const response = await axios.get(url);
    const chats = new Set();

    response.data.result.forEach((update: any) => {
      if (update.message && update.message.chat) {
        chats.add(update.message.chat.id);
      }
    });

    logger.info('Successfully retrieved Telegram chats');
    return Array.from(chats);
  } catch (error) {
    logger.error('Error retrieving Telegram chats:', error);
    throw error;
  }
}

export async function sendTelegramNotification(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    logger.error('Telegram bot token or chat ID is not set');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const chats = await getTelegramChats();
  if (!chats || chats.length === 0) {
    logger.warn('No Telegram chats available');
    return;
  }

  for (const chatId of chats) {
    const data = {
      chat_id: chatId,
      text: message,
    };
    try {
      await axios.post(url, data);
      logger.info(`Telegram notification sent successfully to chat ${chatId}`);
    } catch (error) {
      logger.error(`Error sending Telegram notification to chat ${chatId}:`, error);
    }
  }
}
