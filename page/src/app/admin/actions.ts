"use server";

import { sendAdminNotification } from "@/lib/discord";
import { getDb } from "@/lib/firebase";

const ADMIN_USER_ID = "1201985296011366430";

interface ActionResult {
    success: boolean;
    message: string;
}

export async function addCoinsToUser(adminId: string, targetUserId: string, amount: number): Promise<ActionResult> {
  if (adminId !== ADMIN_USER_ID) {
    return { success: false, message: 'Acción no autorizada.' };
  }

  if (!targetUserId || !amount || isNaN(amount) || amount <= 0) {
      return { success: false, message: 'Datos de entrada inválidos.' };
  }

  try {
    const db = await getDb();
    const userCoinRef = db.ref(`users/${targetUserId}/coins`);
    const adminUserRef = db.ref(`users/${adminId}`);

    // Get admin's name for logging purposes
    const adminSnapshot = await adminUserRef.once('value');
    const adminName = adminSnapshot.child('username').val() || `Admin (${adminId})`;

    const transactionResult = await userCoinRef.transaction((currentCoins) => {
      // If user doesn't exist, this will start them at `amount`. Otherwise, it adds to existing balance.
      return (currentCoins || 0) + amount;
    });

    if (!transactionResult.committed) {
       return { success: false, message: 'No se pudo completar la transacción. Inténtalo de nuevo.' };
    }
    
    const finalBalance = transactionResult.snapshot.val();

    // Send notification without blocking the response
    sendAdminNotification(
        adminName,
        targetUserId,
        amount, 
        finalBalance
    ).catch(e => console.error("Discord admin notification failed in background:", e));

    return { success: true, message: `Se añadieron ${amount} monedas a ${targetUserId}. Nuevo saldo: ${finalBalance}.` };

  } catch (error) {
    console.error("Error adding coins with Firebase Admin:", error);
    return { success: false, message: 'Ocurrió un error en el servidor. Inténtalo de nuevo.' };
  }
}
