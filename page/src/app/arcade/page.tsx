
"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Home as HomeIcon, Mail, ShoppingCart, Gamepad, Bot, Snail, Skull } from "lucide-react";
import { DiscordIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";

export default function Arcade() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center" prefetch={false}>
          <Image src="https://raw.githubusercontent.com/Luisfont13/img/main/1.png" width={24} height={24} alt="MDL United Logo" className="h-6 w-6 rounded-md" />
          <span className="sr-only">MDL United</span>
        </Link>
        <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-headline font-bold hidden sm:block">MDL United</h1>
        </div>
        <nav className="ml-auto hidden md:flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Home
          </Link>
          <Link href="/arcade" className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Arcade <Badge variant="secondary">Beta</Badge>
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Contáctanos
          </Link>
          <Link href="/store" className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Tienda <Badge variant="secondary">Beta</Badge>
          </Link>
          <Button asChild className="transform transition-transform duration-300 hover:scale-105">
            <Link href="https://discord.gg/ZRWCMHuHjg" prefetch={false}>
              <DiscordIcon className="mr-2 h-5 w-5 rounded-md" />
              Únete a Discord
            </Link>
          </Button>
          <ModeToggle />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle>
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                <Image src="https://raw.githubusercontent.com/Luisfont13/img/main/1.png" width={24} height={24} alt="MDL United Logo" className="h-6 w-6 rounded-md" />
                <span>MDL United</span>
              </Link>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navegación principal del sitio
            </SheetDescription>
            <nav className="grid gap-4 text-lg font-medium mt-8">
              <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>
              <Link href="/arcade" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                <Gamepad className="h-5 w-5" />
                Arcade <Badge variant="secondary">Beta</Badge>
              </Link>
              <Link href="/contact" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                <Mail className="h-5 w-5" />
                Contáctanos
              </Link>
              <Link href="/store" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" prefetch={false}>
                <ShoppingCart className="h-5 w-5" />
                Tienda <Badge variant="secondary">Beta</Badge>
              </Link>
            </nav>
            <div className="absolute bottom-8 left-0 right-0 px-6">
              <Button asChild size="lg" className="w-full transform transition-transform duration-300 hover:scale-105">
                  <Link href="https://discord.gg/ZRWCMHuHjg" prefetch={false}>
                    <DiscordIcon className="mr-2 h-5 w-5 rounded-md" />
                    Únete a Discord
                  </Link>
              </Button>
            </div>
            <div className="absolute bottom-24 left-0 right-0 px-6 flex justify-center">
                <ModeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Arcade</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Juegos y diversión. ¡Demuestra tu habilidad!
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 pt-12">
                <Card className="flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Skull className="text-primary"/> Dino Run</CardTitle>
                        <CardDescription>Un dinosaurio escapa del vacío que consume el mundo. ¿Hasta dónde puedes llegar?</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p>Controles: Salta con la barra espaciadora.</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/arcade/dino-run">Jugar ahora</Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Snail className="text-primary"/> Snake</CardTitle>
                        <CardDescription>El clásico juego de la serpiente. Crece comiendo, ¡pero no te muerdas la cola!</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p>Controles: Usa las teclas de flecha para moverte.</p>
                    </CardContent>
                     <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/arcade/snake">Jugar ahora</Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> Juego 3</CardTitle>
                        <CardDescription>Descripción del juego 3.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p>Próximamente...</p>
                    </CardContent>
                     <CardFooter>
                        <Button className="w-full" disabled>Próximamente</Button>
                    </CardFooter>
                </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 MDL United. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Términos de Servicio
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
