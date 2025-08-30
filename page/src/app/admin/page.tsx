
"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addCoinsToUser } from "./actions";
import { Shield, Coins } from "lucide-react";

const ADMIN_USER_ID = "1201985296011366430";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [targetUserId, setTargetUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
        toast({ title: "Error", description: "Debes iniciar sesión.", variant: "destructive"});
        return;
    }

    setIsSubmitting(true);
    const parsedAmount = parseInt(amount, 10);
    
    try {
        const result = await addCoinsToUser(session.user.id, targetUserId, parsedAmount);
        if (result.success) {
            toast({ title: "Éxito", description: result.message });
            setTargetUserId('');
            setAmount('');
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    } catch (error) {
         toast({ title: "Error de Red", description: "No se pudo conectar con el servidor.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  
  if (status === "unauthenticated" || session?.user?.id !== ADMIN_USER_ID) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <Shield className="h-24 w-24 text-destructive" />
        <h1 className="text-4xl font-bold mt-4">Acceso Denegado</h1>
        <p className="text-muted-foreground mt-2">No tienes permisos para acceder a esta página.</p>
        <Button asChild className="mt-6">
            <Link href="/">Volver al Inicio</Link>
        </Button>
      </div>
    );
  }
  

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-body">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/95 backdrop-blur">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image src="https://raw.githubusercontent.com/Luisfont13/img/main/1.png" width={24} height={24} alt="MDL United Logo" className="h-6 w-6 rounded-md" />
          <span className="font-bold">Panel de Admin</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Coins className="text-primary"/>
                    Añadir Monedas a Usuario
                </CardTitle>
                <CardDescription>
                    Introduce el ID de Discord del usuario y la cantidad de monedas a añadir. Esta acción es irreversible y quedará registrada.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="userId">ID de Usuario de Discord</Label>
                        <Input 
                            id="userId" 
                            placeholder="Ej: 123456789012345678" 
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Cantidad de Monedas</Label>
                        <Input 
                            id="amount" 
                            type="number" 
                            placeholder="Ej: 500" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required 
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Procesando...' : 'Añadir Monedas'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
      </main>
    </div>
  );
}
