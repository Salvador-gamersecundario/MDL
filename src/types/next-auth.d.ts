
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Extiende el objeto `Session` para incluir nuestras propiedades personalizadas.
   */
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
    
  }

   /**
   * Extiende el objeto `User` para incluir el id.
   */
  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extiende el token JWT para incluir nuestras propiedades personalizadas.
   */
  interface JWT {
    id: string;
  }
}
