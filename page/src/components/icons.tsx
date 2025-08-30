import type { SVGProps } from "react";
import Image from "next/image";

export function DiscordIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <Image src="https://raw.githubusercontent.com/Luisfont13/img/main/discord.png" width="24" height="24" alt="Discord Logo" {...props} className="h-6 w-6 rounded-md" />
    )
  }
