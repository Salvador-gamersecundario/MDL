
"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Home as HomeIcon, Mail, ShoppingCart, LogOut, Wallet, RefreshCcw, Gamepad, Lock } from "lucide-react";
import { DiscordIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { purchaseItem, getUserData } from "@/app/store/actions";
import { useState, useEffect, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StoreItem {
  id: string;
  name: string;
  price: number;
  image: string;
  hint: string;
}

const STORE_PASSWORD = "XX-765-766-XXX";

export default function Store() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState(0);
  const [isLoadingCoins, setIsLoadingCoins] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [hasAgreed, setHasAgreed] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === STORE_PASSWORD) {
        setIsAuthenticated(true);
        setAuthError('');
    } else {
        setAuthError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  }


  const fetchUserData = useCallback(async () => {
    if (status === 'authenticated' && session?.user?.id) {
        setIsLoadingCoins(true);
        try {
            const data = await getUserData(session.user.id);
            if (data.coins !== undefined) {
                setUserCoins(data.coins);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar tus monedas.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingCoins(false);
        }
    }
  }, [status, session, toast]);


  useEffect(() => {
    if(isAuthenticated) {
        fetchUserData();
    }
  }, [fetchUserData, session, isAuthenticated]);


  const storeItems: StoreItem[] = [
    { id: "camiseta", name: "Camiseta del Clan", price: 250, image: "https://placehold.co/400x400.png", hint: "clan t-shirt" },
    { id: "sudadera", name: "Sudadera con Capucha", price: 450, image: "https://placehold.co/400x400.png", hint: "clan hoodie" },
    { id: "gorra", name: "Gorra Exclusiva", price: 200, image: "https://placehold.co/400x400.png", hint: "clan cap" },
    { id: "taza", name: "Taza de Café", price: 150, image: "https://placehold.co/400x400.png", hint: "clan mug" },
  ];

  const handlePurchase = async () => {
    if (!session?.user?.id || !selectedItem) return;

    setIsPurchasing(selectedItem.id);

    try {
      const result = await purchaseItem(
          session.user.id, 
          selectedItem.name, 
          selectedItem.price,
          session.user.name ?? undefined,
          session.user.image ?? undefined
      );

      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: result.message,
        });
        if (result.newBalance !== undefined) {
          setUserCoins(result.newBalance);
        }
      } else {
        toast({
          title: "Error en la compra",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
        title: "Error en la compra",
        description: "No se pudo conectar con el servicio. Inténtalo más tarde.",
        variant: "destructive",
      });
    }

    setIsPurchasing(null);
    setSelectedItem(null); 
    setHasAgreed(false);
  };


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
              <DiscordIcon className="mr-2 h-5 w-5" />
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
                    <DiscordIcon className="mr-2 h-5 w-5" />
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Tienda del Clan</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  {isAuthenticated ? "¡Usa tus monedas para conseguir merchandising oficial de MDL United y apoyar al clan!" : "Esta es una tienda privada. Por favor, introduce la contraseña para acceder."}
                </p>
                 <Badge variant="secondary">Beta</Badge>
              </div>
            </div>

            {!isAuthenticated ? (
                <div className="mx-auto w-full max-w-sm space-y-6 py-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lock /> Acceso Restringido</CardTitle>
                        </CardHeader>
                        <form onSubmit={handlePasswordSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input 
                                        id="password" 
                                        type="password"
                                        placeholder="Introduce la contraseña" 
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        required 
                                    />
                                </div>
                                {authError && <p className="text-sm text-destructive">{authError}</p>}
                            </CardContent>
                            <CardFooter>
                               <Button type="submit" className="w-full">Entrar</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            ) : (
                <>
                    <div className="mx-auto w-full max-w-2xl py-12 space-y-4">
                    {status !== 'loading' && (
                        <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <DiscordIcon className="h-6 w-6" />
                            {status === 'authenticated' ? 'Perfil Conectado' : 'Conectar con Discord'}
                            </CardTitle>
                            <CardDescription>
                            {status === 'authenticated' ? 'Gestiona tu sesión y revisa tus monedas.' : 'Conecta tu cuenta para comprar y ver tus monedas.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status === 'authenticated' && session ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'Avatar'} />
                                    <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                    <p className="font-semibold">{session.user?.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Wallet className="h-4 w-4 text-primary" />
                                        {isLoadingCoins ? (
                                            <span>Cargando...</span>
                                        ) : (
                                            <span>{userCoins.toLocaleString()} monedas</span>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fetchUserData} disabled={isLoadingCoins}>
                                            <RefreshCcw className={`h-4 w-4 ${isLoadingCoins ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => { signOut() }}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Desconectar
                                </Button>
                                </div>
                            ) : (
                            <Button 
                                className="w-full transform transition-transform duration-300 hover:scale-105"
                                onClick={() => { signIn('discord') }}
                            >
                                Conectar con Discord
                            </Button>
                            )}
                        </CardContent>
                        </Card>
                    )}
                    </div>
                    <AlertDialog onOpenChange={(open) => { if (!open) { setHasAgreed(false); setSelectedItem(null); }}}>
                        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 pt-12">
                        {storeItems.map((item) => (
                            <Card key={item.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="flex flex-col items-center justify-center p-0 overflow-hidden rounded-t-lg">
                                <Image src={item.image} alt={item.name} data-ai-hint={item.hint} width={400} height={400} className="object-cover" />
                            </CardContent>
                            <CardHeader className="text-center">
                                <CardTitle>{item.name}</CardTitle>
                                <CardDescription className="flex items-center justify-center gap-1">
                                    <Wallet className="h-4 w-4" />
                                    {item.price.toLocaleString()} monedas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AlertDialogTrigger asChild>
                                <Button 
                                    className="w-full transform transition-transform duration-300 hover:scale-105"
                                    onClick={() => setSelectedItem(item)}
                                    disabled={status !== 'authenticated' || isPurchasing !== null}
                                    >
                                    {isPurchasing === item.id ? 'Procesando...' : (status === 'authenticated' ? 'Comprar' : 'Conéctate para comprar')}
                                </Button>
                                </AlertDialogTrigger>
                            </CardContent>
                            </Card>
                        ))}
                        </div>
                        {selectedItem && (
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Compra</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Estás a punto de comprar <strong>{selectedItem.name}</strong> por <strong>{selectedItem.price.toLocaleString()} monedas</strong>. Esta acción es irreversible.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4 space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Acuerdos de Compra:</strong>
                                        <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>El saldo de monedas se descontará de tu cuenta de Discord.</li>
                                        <li>No se admiten reembolsos ni devoluciones.</li>
                                        <li>Asegúrate de tener suficientes monedas antes de continuar.</li>
                                        </ul>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="terms" checked={hasAgreed} onCheckedChange={(checked) => setHasAgreed(checked as boolean)} />
                                        <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            He leído y acepto los acuerdos de compra.
                                        </Label>
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setHasAgreed(false)}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handlePurchase} disabled={!hasAgreed}>
                                    Confirmar Compra
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        )}
                    </AlertDialog>
                </>
            )}

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


    