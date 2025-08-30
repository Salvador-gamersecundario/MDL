
"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Gamepad2, Box, Crosshair, Users, CalendarDays, Menu, Home as HomeIcon, Mail, ShoppingCart, Crown, Gamepad } from "lucide-react";
import { DiscordIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center items-center text-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Bienvenidos a MDL United
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    La comunidad definitiva para jugadores de Minecraft, Roblox y Fortnite. Únete a nosotros para eventos, torneos y una increíble experiencia de juego.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="lg" className="transform transition-transform duration-300 hover:scale-105">
                        Explorar Juegos
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href="#" className="flex items-center gap-2 w-full">
                          <Box className="h-5 w-5" />
                          <span>Minecraft</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="#" className="flex items-center gap-2 w-full">
                          <Crosshair className="h-5 w-5" />
                          <span>Fortnite</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="#" className="flex items-center gap-2 w-full">
                          <Gamepad2 className="h-5 w-5" />
                          <span>Roblox</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem>
                        <Link href="#" className="flex items-center gap-2 w-full">
                          <Crown className="h-5 w-5" />
                          <span>Clash Royale</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="gaming clan characters"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="highlights" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Nuestros Mejores Momentos</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Mira algunas de las jugadas más épicas de nuestro clan en nuestros juegos favoritos.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <Carousel className="w-full">
                <CarouselContent>
                  <CarouselItem>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                        <Image src="https://placehold.co/1280x720.png" alt="Minecraft highlight" data-ai-hint="minecraft landscape" width={1280} height={720} className="object-cover" />
                      </CardContent>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Box /> Minecraft</CardTitle>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                  <CarouselItem>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                        <Image src="https://placehold.co/1280x720.png" alt="Roblox highlight" data-ai-hint="roblox game" width={1280} height={720} className="object-cover"/>
                      </CardContent>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gamepad2 /> Roblox</CardTitle>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                  <CarouselItem>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                        <Image src="https://placehold.co/1280x720.png" alt="Fortnite highlight" data-ai-hint="fortnite battle" width={1280} height={720} className="object-cover"/>
                      </CardContent>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Crosshair /> Fortnite</CardTitle>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </section>

        <section id="community" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Una Comunidad Sin Toxicidad</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                En MDL United, creemos en una comunidad libre de toxicidad. Fomentamos el respeto, la colaboración y, sobre todo, la diversión.
              </p>
            </div>
            <div className="relative flex justify-center">
              <Users className="w-24 h-24 text-accent transition-transform duration-300 hover:scale-110" />
            </div>
          </div>
        </section>

        <section id="events" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Calendario de Eventos</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Siempre hay algo sucediendo en MDL United. ¡Revisa nuestro calendario y únete a la acción!
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 pt-12">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarDays className="text-primary"/>Eventos Diarios</CardTitle>
                  <CardDescription>Partidas rápidas, torneos amistosos y más.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Únete a nosotros todos los días para partidas casuales y desafíos divertidos en tus juegos favoritos.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarDays className="text-primary"/>Eventos Semanales</CardTitle>
                  <CardDescription>Noches de clan, torneos especiales y streams.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Los fines de semana son para eventos más grandes. Compite por premios y demuestra tus habilidades.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><DiscordIcon className="h-6 w-6 text-primary"/>Únete a Discord</CardTitle>
                  <CardDescription>Toda la coordinación se hace en nuestro servidor.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>No te pierdas ninguna actividad. ¡Nuestro Discord es el centro de toda la comunidad!</p>
                </CardContent>
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

    
