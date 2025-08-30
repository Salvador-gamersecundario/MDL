
import { sendAdminNotification } from "@/lib/discord";
import { getDb } from "@/lib/firebase";

// "use server" directive is removed to allow static export.
// This file will not be functional in a static environment.

const ADMIN_USER_ID = "1201985296011366430";

interface ActionResult {
    success: boolean;
    message: string;
}

export async function addCoinsToUser(adminId: string, targetUserId: string, amount: number): Promise<ActionResult> {
  // This check is client-side, but the action itself will not run in a static build.
  if (adminId !== ADMIN_USER_ID) {
    return { success: false, message: 'Acción no autorizada.' };
  }

  if (!targetUserId || !amount || isNaN(amount) || amount <= 0) {
      return { success: false, message: 'Datos de entrada inválidos.' };
  }
  
  // The following server-side code will not execute in a static export.
  // We return a mocked success response for the UI.
  console.warn("addCoinsToUser is a Server Action and will not run in a static export.");
  return { success: false, message: 'Esta función no está disponible en la versión de demostración estática.' };
}
