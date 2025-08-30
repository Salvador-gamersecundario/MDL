
"use client";

import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { useEffect } from "react";

// Este es un ejemplo de cómo podrías integrar un script de anuncio
const AdCode = `
  <!-- Aquí pegarías el código de tu proveedor de anuncios, por ejemplo, Google AdSense -->
  <!-- Ejemplo (NO USAR, es solo ilustrativo):
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
       crossorigin="anonymous"></script>
  <ins class="adsbygoogle"
       style="display:block; text-align:center;"
       data-ad-layout="in-article"
       data-ad-format="fluid"
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot="1234567890"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
  -->
`;

// Declaramos la variable adsbygoogle en el objeto window para evitar errores de TypeScript
declare global {
    interface Window {
         adsbygoogle?: any[];
    }
}


export function AdPlaceholder({ className }: { className?: string }) {
  // Cuando obtengas tu código de AdSense, reemplaza el contenido de esta variable.
  const isAdsenseCodePresent = false; 

  // Usamos useEffect para "empujar" el anuncio cada vez que el componente se monta,
  // que es lo que AdSense recomienda para aplicaciones de una sola página (SPA).
  useEffect(() => {
    if (isAdsenseCodePresent) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Error pushing adsbygoogle:", e);
      }
    }
  }, []);


  if (isAdsenseCodePresent) {
    return (
       <div 
        className={cn("w-full max-w-lg mx-auto my-8", className)}
        dangerouslySetInnerHTML={{ __html: AdCode }} 
       />
    );
  }

  // Si no hay código de anuncio, mostramos el marcador de posición
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full max-w-lg mx-auto my-8 p-4 rounded-lg bg-muted border border-dashed text-muted-foreground",
        className
      )}
    >
      <DollarSign className="h-8 w-8 mb-2" />
      <p className="text-sm font-semibold">Espacio para Anuncio</p>
      <p className="text-xs text-center mt-1">
        Para monetizar, regístrate en una red de anuncios (ej. Google AdSense) y pega el código en este componente.
      </p>
    </div>
  );
}
