'use server';

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  author?: {
    name: string;
    icon_url?: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}

export async function sendPurchaseNotification(
  username: string,
  userAvatar: string | undefined,
  itemName: string,
  itemPrice: number,
  newBalance: number
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('Discord webhook URL is not configured.');
    // No lanzamos un error para no romper la compra si solo falla la notificación
    return;
  }

  const embed: DiscordEmbed = {
    color: 0x57f287, // Color verde
    title: '✅ Nueva Compra Realizada',
    author: {
      name: username,
      icon_url: userAvatar,
    },
    fields: [
      { name: 'Artículo', value: itemName, inline: true },
      { name: 'Precio', value: `${itemPrice.toLocaleString()} monedas`, inline: true },
      { name: 'Saldo Restante', value: `${newBalance.toLocaleString()} monedas`, inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Tienda MDL United',
      icon_url: 'https://raw.githubusercontent.com/Luisfont13/img/main/1.png',
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: "Registro de Compras",
        avatar_url: "https://raw.githubusercontent.com/Luisfont13/img/main/1.png",
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Failed to send Discord notification. Status: ${response.status}. Body: ${errorBody}`);
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}
