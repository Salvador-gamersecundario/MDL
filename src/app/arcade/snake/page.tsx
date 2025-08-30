
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Snail, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { AdPlaceholder } from '@/components/ad-placeholder';

const GRID_SIZE = 20;
const GAME_DIMENSIONS = 400;
const TILE_SIZE = GAME_DIMENSIONS / GRID_SIZE;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 }; // Right
const GAME_SPEED = 150; // ms

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const directionRef = useRef(direction);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(createFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  const createFood = (currentSnake: {x: number, y: number}[]) => {
    while (true) {
      const newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        return newFood;
      }
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const key = e.key;
    const currentDirection = directionRef.current;
    
    if (key === 'ArrowUp' && currentDirection.y === 0) directionRef.current = { x: 0, y: -1 };
    else if (key === 'ArrowDown' && currentDirection.y === 0) directionRef.current = { x: 0, y: 1 };
    else if (key === 'ArrowLeft' && currentDirection.x === 0) directionRef.current = { x: -1, y: 0 };
    else if (key === 'ArrowRight' && currentDirection.x === 0) directionRef.current = { x: 1, y: 0 };
    else if (key === ' ' && !gameStarted) resetGame();
  }, [gameStarted, resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameInterval = setInterval(() => {
      setDirection(directionRef.current);
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        head.x += directionRef.current.x;
        head.y += directionRef.current.y;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setGameOver(true);
            return prevSnake;
          }
        }
        
        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood(createFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameInterval);
  }, [gameStarted, gameOver, food]);


  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground p-4">
        <Button asChild variant="outline" className="absolute top-4 left-4">
            <Link href="/arcade">Volver al Arcade</Link>
        </Button>
      <Card className="w-full max-w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Snail /> Snake</span>
            <span>Puntuación: {score}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-muted rounded-md grid"
            style={{
              width: GAME_DIMENSIONS,
              height: GAME_DIMENSIONS,
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              border: `1px solid hsl(var(--border))`
            }}
          >
             {!gameStarted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center col-span-full row-span-full">
                <h2 className="text-4xl font-bold mb-4">Snake</h2>
                <Button onClick={resetGame}>Empezar a Jugar</Button>
                <p className="mt-4 text-sm text-muted-foreground">(Usa las flechas para moverte)</p>
              </div>
            ) : gameOver ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 col-span-full row-span-full">
                <h2 className="text-4xl font-bold text-white mb-2">Has Perdido</h2>
                <p className="text-white mb-4">Puntuación Final: {score}</p>
                <Button onClick={resetGame}>Jugar de Nuevo</Button>
              </div>
            ) : null}
           
            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className="rounded-[2px]"
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  backgroundColor: index === 0 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary))',
                  border: index === 0 ? '1px solid hsl(var(--primary))' : '',
                }}
              />
            ))}

            {/* Food */}
            <div
              className="rounded-full"
              style={{
                gridColumnStart: food.x + 1,
                gridRowStart: food.y + 1,
                backgroundColor: 'hsl(var(--destructive))'
              }}
            />
          </div>
        </CardContent>
      </Card>
      <AdPlaceholder />
    </div>
  );
}
