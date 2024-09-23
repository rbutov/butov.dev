import axios from 'axios';
import * as logger from 'firebase-functions/logger';

import { db } from './firebase';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function getTelegramChats(): Promise<string[]> {
  if (!TELEGRAM_BOT_TOKEN) {
    logger.error('Telegram bot token is not set');
    return [];
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
    return Array.from(chats) as string[];
  } catch (error) {
    logger.error('Error retrieving Telegram chats:', error);
    throw error;
  }
}

export async function sendTelegramMessage(
  chatId: string,
  message: string
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    logger.error('Telegram bot token is not set');
    return;
  }
  if (!message || !chatId) {
    logger.error('Message or chatId is empty');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const data = {
    chat_id: chatId,
    text: message,
  };

  try {
    await axios.post(url, data);
    logger.info(`Telegram notification sent successfully to chat ${chatId}`);
  } catch (error) {
    logger.error(
      `Error sending Telegram notification to chat ${chatId}:`,
      error
    );
  }
}

export async function sendMessageToAllSubscribers(
  message: string
): Promise<void> {
  const subscribersSnapshot = await db
    .collection('subscribers')
    .where('isSubscribed', '==', true)
    .get();

  const sendPromises = subscribersSnapshot.docs.map(async (doc) => {
    const subscriber = doc.data();
    await sendTelegramMessage(subscriber.chatId, message);
  });

  await Promise.all(sendPromises);
}

export async function checkAppleProductAvailability(): Promise<void> {
  try {
    // Check if there are active subscribers before proceeding
    const subscribersSnapshot = await db
      .collection('subscribers')
      .where('isSubscribed', '==', true)
      .get();
    if (subscribersSnapshot.empty) {
      logger.info(
        'No active subscribers. Skipping product availability check.'
      );
      return;
    }

    // Iterate through each subscriber
    for (const doc of subscribersSnapshot.docs) {
      const subscriber = doc.data();
      const productId = subscriber.productId;
      const zipCode = subscriber.zipCode;
      const chatId = subscriber.chatId;

      await checkProductAvailabilityByZipCode(productId, zipCode, chatId);
    }
  } catch (error) {
    logger.error('Error checking product availability:', error);
  }
}

export async function checkProductAvailabilityByZipCode(
  productId: string,
  zipCode: string,
  chatId: string,
  force = false
): Promise<void> {
  const url = 'https://www.apple.com/shop/pickup-message-recommendations';
  const params = {
    'mts.0': 'regular',
    'mts.1': 'compact',
    cppart: 'UNLOCKED/US',
    location: zipCode,
    product: productId,
  };

  try {
    const response = await axios.get(url, { params });
    const data = response.data;

    // Check if the product exists in the response
    const availableStores = data.body?.PickupMessage?.stores?.filter(
      (store: any) => params.product in store.partsAvailability
    );

    if (availableStores && availableStores.length > 0) {
      logger.info(
        `Product ${productId} is available for subscriber with chat ID ${chatId}.`
      );
      // Send notification to the current subscriber
      await sendTelegramMessage(
        chatId,
        `Product ${productId} is now available in ${availableStores.length} stores near you!`
      );
    } else {
      logger.info(
        `Product ${productId} is not available for subscriber with chat ID ${chatId}.`
      );
      const currentDate = new Date();
      const pstDate = new Date(
        currentDate.toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles',
        })
      );
      const currentHour = pstDate.getHours();

      if (currentHour === 10 || currentHour === 20 || force) {
        const currentMinute = pstDate.getMinutes();

        if (currentMinute === 0 || force) {
          // Send notification to the current subscriber
          await sendTelegramMessage(
            chatId,
            `Product ${productId} is not available.`
          );
        }
      }
    }
  } catch (error) {
    logger.error('Error checking product availability by ZIP code:', error);
  }
}
