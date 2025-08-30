
import { sendPurchaseNotification } from '@/lib/discord';
import { getDb } from '@/lib/firebase';

// "use server" directive is removed to allow static export.
// This file will not be functional in a static environment.

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
  // This server-side code will not execute in a static export.
  // We return a mocked response.
  console.warn("getUserData is a Server Action and will not run in a static export.");
  return { coins: 0 };
}


export async function purchaseItem(userId: string, itemName:string, price: number, userName?: string, userAvatar?: string): Promise<PurchaseResult> {
  if (!userId) {
      return { success: false, message: 'Usuario no autenticado.' };
  }

  // The following server-side code will not execute in a static export.
  // We return a mocked success response for the UI.
  console.warn("purchaseItem is a Server Action and will not run in a static export.");
  return { success: false, message: 'Esta función no está disponible en la versión de demostración estática.' };
}
