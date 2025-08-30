'use server';

import { sendPurchaseNotification } from '@/lib/discord';
import { getDb } from '@/lib/firebase';


interface PurchaseResult {
    success: boolean;
    message: string;
    newBalance?: number;
}

interface UserDataResult {
    coins: number;
}

// Function to get user coins and ensure user exists
export async function getUserData(userId: string): Promise<UserDataResult> {
  try {
    const db = await getDb();
    const userRef = db.ref(`users/${userId}`);
    let snapshot = await userRef.once('value');

    // If user does not exist, create them with 0 coins
    if (!snapshot.exists()) {
      console.log(`Registering new user via store action: ${userId}`);
      await userRef.child('coins').set(0);
      snapshot = await userRef.once('value'); // Re-fetch snapshot
    }
    
    const coins = snapshot.child('coins').val() || 0;
    return { coins };

  } catch (error) {
    console.error("Error getting user data from Firebase:", error);
    throw new Error("Could not retrieve user data.");
  }
}


export async function purchaseItem(userId: string, itemName:string, price: number, userName?: string, userAvatar?: string): Promise<PurchaseResult> {
  if (!userId) {
      return { success: false, message: 'Usuario no autenticado.' };
  }

  try {
    const db = await getDb();
    const userCoinRef = db.ref(`users/${userId}/coins`);

    const transactionResult = await userCoinRef.transaction((currentCoins) => {
      if (currentCoins === null || typeof currentCoins !== 'number') {
        currentCoins = 0;
      }
      
      if (currentCoins < price) {
        return; // Abort transaction
      }
      
      return currentCoins - price;
    });

    if (!transactionResult.committed) {
       return { success: false, message: 'No tienes suficientes monedas para realizar esta compra.' };
    }
    
    const finalBalance = transactionResult.snapshot.val();

    // Send notification without blocking the response
    if (userName && finalBalance !== undefined) {
      sendPurchaseNotification(
          userName,
          userAvatar || undefined,
          itemName, 
          price, 
          finalBalance
      ).catch(e => console.error("Discord notification failed in background:", e));
    }

    return { success: true, message: '¡Compra realizada con éxito!', newBalance: finalBalance };

  } catch (error) {
    console.error("Error processing purchase with Firebase Admin:", error);
    return { success: false, message: 'Ocurrió un error al procesar tu compra. Inténtalo de nuevo.' };
  }
}
