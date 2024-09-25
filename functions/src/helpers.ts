import axios from 'axios';
import * as logger from 'firebase-functions/logger';

import { db } from './firebase';

/**
 * Telegram bot token retrieved from environment variables
 */
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Retrieves a list of unique Telegram chat IDs from recent updates
 * @returns {Promise<string[]>} Array of unique chat IDs
 */
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

/**
 * Sends a message to a specific Telegram chat
 * @param {string} chatId - The ID of the chat to send the message to
 * @param {string} message - The message to be sent
 */
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

/**
 * Sends a message to all subscribed users
 * @param {string} message - The message to be sent to all subscribers
 */
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

/**
 * Checks Apple product availability for all subscribed users
 */
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

/**
 * Checks product availability for a specific product ID and ZIP code
 * @param {string} productId - The ID of the product to check
 * @param {string} zipCode - The ZIP code to check availability in
 * @param {string} chatId - The chat ID to send notifications to
 * @param {boolean} force - Whether to force send a notification regardless of time
 */
export async function checkProductAvailabilityByZipCode(
  productId: string,
  zipCode: string,
  chatId: string,
  force = false
): Promise<void> {
  const url = 'https://www.apple.com/shop/fulfillment-messages';
  const params = {
    pl: true,
    'mts.0': 'regular',
    'mts.1': 'compact',
    cppart: 'UNLOCKED/US',
    location: zipCode,
    'parts.0': productId,
  };

  try {
    const response = await axios.get(url, { params });
    const data = response.data;

    // Check if the product exists in the response
    const availableStores = data.body?.content?.pickupMessage?.stores?.filter(
      (store: any) =>
        productId in store.partsAvailability &&
        store.partsAvailability[productId]?.buyability?.isBuyable
    );

    if (availableStores && availableStores.length > 0) {
      logger.info(
        `Product ${productId} is available for subscriber with chat ID ${chatId}.`
      );
      // Send notification to the current subscriber
      const storeInfo = availableStores
        .slice(0, 7)
        .map(
          (store: any) =>
            `${store.storeName}, zip:${store?.address?.postalCode} (${store.storedistance} miles)`
        )
        .join(', ');

      await sendTelegramMessage(
        chatId,
        `Product ${productId} is now available in ${availableStores.length} stores near you! Closest stores: ${storeInfo}`
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
