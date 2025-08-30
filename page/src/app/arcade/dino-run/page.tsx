
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skull, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { AdPlaceholder } from '@/components/ad-placeholder';


const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;

// Sprite coordinates and dimensions from the sheet
const SPRITE_SHEET_URL = 'https://raw.githubusercontent.com/loparcog/chrome-dinosaur/master/sprite.png';

const DINO_IDLE = { x: 76, y: 0, w: 88, h: 94 };
const DINO_DEAD = { x: 1778, y: 0, w: 88, h: 94 };
const DINO_RUN_1 = { x: 1514, y: 0, w: 88, h: 94 };
const DINO_RUN_2 = { x: 1602, y: 0, w: 88, h: 94 };
const DINO_CROUCH_1 = { x: 1866, y: 0, w: 118, h: 60 };
const DINO_CROUCH_2 = { x: 1984, y: 0, w: 118, h: 60 };

const GROUND = { x: 2, y: 104, w: 2400, h: 26 };
const GAME_OVER_TEXT = { x: 1294, y: 28, w: 382, h: 24 };

const CACTUS_SMALL = [
  { x: 446, y: 0, w: 34, h: 70 },   // 1 small
  { x: 480, y: 0, w: 68, h: 70 },   // 2 small
  { x: 548, y: 0, w: 102, h: 70 },  // 3 small
];

const CACTUS_BIG = [
  { x: 652, y: 0, w: 50, h: 100 },  // 1 big
  { x: 702, y: 0, w: 100, h: 100 }, // 2 big
  { x: 802, y: 0, w: 150, h: 100 }, // 3 big
];

const PTERODACTYL = [
  { x: 260, y: 0, w: 92, h: 80 }, // Frame 1
  { x: 352, y: 0, w: 92, h: 80 }, // Frame 2
];


export default function DinoRunGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number>();
  const spriteImgRef = useRef<HTMLImageElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [hasRevived, setHasRevived] = useState(false);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game state variables
    let gamespeed = 0;
    const grav = 0.6;
    
    const p = {
      x: 50,
      y: GAME_HEIGHT - GROUND.h,
      w: DINO_RUN_1.w / 1.5,
      h: DINO_RUN_1.h / 1.5,
      yv: 0,
      jump: 15,
      onG: true,
      isCrouching: false
    };

    let obstacles: { x: number, y: number, w: number, h: number, sprite: any, type: 'cactus' | 'bird', animFrame?: number }[] = [];
    let groundscroll = 0;
    let currentScore = 0;
    let localHighScore = 0;
    
    let animFrame = 0;
    let frameTimer = 0;
    let scoreTimer = 0;
    let obstacleTimer = 0;

    let isGameOver = true;
    let isKeyDown = false;
    
    function gameLoop() {
      if (isGameOver) {
        drawGameOver();
        return;
      };
      update();
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    function resetGame() {
        isGameOver = false;
        setGameOver(false);
        setGameStarted(true);
        setHasRevived(false);

        gamespeed = 7;
        p.y = GAME_HEIGHT - GROUND.h - p.h;
        p.yv = 0;
        p.onG = true;
        p.isCrouching = false;
        obstacles = [];
        currentScore = 0;
        setScore(0);
        groundscroll = 0;
        animFrame = 0;
        frameTimer = 0;
        scoreTimer = 0;
        obstacleTimer = 0;
        
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    function reviveGame() {
      isGameOver = false;
      setGameOver(false);
      setHasRevived(true); // Mark as revived

      // Keep score, but reset other relevant things
      gamespeed = 7 + (currentScore / 100);
      if (gamespeed > 17) gamespeed = 17;
      
      p.y = GAME_HEIGHT - GROUND.h - p.h;
      p.yv = 0;
      p.onG = true;
      p.isCrouching = false;
      obstacles = []; // Clear screen of obstacles
      obstacleTimer = -50; // Give a small delay before new obstacles spawn
      
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    function update() {
      gamespeed = 7 + (currentScore / 100);
      if (gamespeed > 17) gamespeed = 17;
      
      // Player physics
      p.yv += grav;
      p.y += p.yv;

      const groundY = GAME_HEIGHT - GROUND.h;
      
      // Correct height based on state
      const currentDinoHeight = p.isCrouching ? DINO_CROUCH_1.h / 1.5 : DINO_RUN_1.h / 1.5;
      
      if (p.y > groundY - currentDinoHeight) {
          p.y = groundY - currentDinoHeight;
          p.yv = 0;
          p.onG = true;
      }
      
      // Obstacle logic
      obstacleTimer++;
      if (obstacleTimer > 60 && Math.random() < 0.02 && obstacles.length < 2) {
          spawnObstacle();
          obstacleTimer = 0;
      }

      obstacles.forEach((obs, index) => {
          obs.x -= gamespeed;
          if (obs.x + obs.w < 0) {
              setTimeout(() => obstacles.splice(index, 1), 0);
          }

          // Collision detection
          const dinoHitbox = {x: p.x + 10, y: p.y, w: p.w - 20, h: p.h - 10};
          const obsHitbox = {x: obs.x + 5, y: obs.y, w: obs.w - 10, h: obs.h};

          if (
              dinoHitbox.x < obsHitbox.x + obsHitbox.w &&
              dinoHitbox.x + dinoHitbox.w > obsHitbox.x &&
              dinoHitbox.y < obsHitbox.y + obsHitbox.h &&
              dinoHitbox.y + dinoHitbox.h > obsHitbox.y
          ) {
             endGame();
          }
      });
      
      scoreTimer++;
      if(scoreTimer > 5){
        currentScore++;
        setScore(currentScore);
        scoreTimer = 0;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw ground
      groundscroll = (groundscroll + gamespeed) % GROUND.w;
      ctx.drawImage(spriteImgRef.current!, GROUND.x, GROUND.y, GROUND.w, GROUND.h, -groundscroll, GAME_HEIGHT - GROUND.h, GROUND.w, GROUND.h);
      ctx.drawImage(spriteImgRef.current!, GROUND.x, GROUND.y, GROUND.w, GROUND.h, -groundscroll + GROUND.w, GAME_HEIGHT - GROUND.h, GROUND.w, GROUND.h);

      // Player animation and sprite selection
      let dinoSprite;
      frameTimer = (frameTimer + 1) % 10;
      if(frameTimer === 9) {
          animFrame = 1 - animFrame;
      }
      
      if (p.isCrouching) {
        p.w = DINO_CROUCH_1.w / 1.5;
        p.h = DINO_CROUCH_1.h / 1.5;
        dinoSprite = animFrame === 0 ? DINO_CROUCH_1 : DINO_CROUCH_2;
      } else {
        p.w = DINO_RUN_1.w / 1.5;
        p.h = DINO_RUN_1.h / 1.5;
        if (!p.onG) {
            dinoSprite = DINO_IDLE;
        } else {
            dinoSprite = animFrame === 0 ? DINO_RUN_1 : DINO_RUN_2;
        }
      }
      ctx.drawImage(spriteImgRef.current!, dinoSprite.x, dinoSprite.y, dinoSprite.w, dinoSprite.h, p.x, p.y, p.w, p.h);

      // Draw obstacles
      obstacles.forEach(obs => {
        if (obs.type === 'bird') {
            obs.animFrame = Math.floor((frameTimer / 5)) % PTERODACTYL.length;
            ctx.drawImage(spriteImgRef.current!, PTERODACTYL[obs.animFrame!].x, PTERODACTYL[obs.animFrame!].y, PTERODACTYL[obs.animFrame!].w, PTERODACTYL[obs.animFrame!].h, obs.x, obs.y, obs.w, obs.h);
        } else {
            ctx.drawImage(spriteImgRef.current!, obs.sprite.x, obs.sprite.y, obs.sprite.w, obs.sprite.h, obs.x, obs.y, obs.w, obs.h);
        }
      });
    }

    function drawGameOver() {
        if (!spriteImgRef.current) return;
         ctx.drawImage(spriteImgRef.current!, DINO_DEAD.x, DINO_DEAD.y, DINO_DEAD.w, DINO_DEAD.h, p.x, p.y, p.w, p.h);
    }
    
    function endGame() {
        isGameOver = true;
        setGameOver(true);
        if (currentScore > localHighScore) {
            localHighScore = currentScore;
            setHighScore(localHighScore);
        }
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        gameLoop(); // Call it one last time to draw the dead dino
    }
    
    function spawnObstacle() {
        const isBird = Math.random() > 0.5 && currentScore > 300;
        let obstacle;

        if (isBird) {
            obstacle = {
                x: GAME_WIDTH,
                y: GAME_HEIGHT - GROUND.h - [60, 80, 110][Math.floor(Math.random() * 3)],
                w: PTERODACTYL[0].w / 1.5,
                h: PTERODACTYL[0].h / 1.5,
                sprite: PTERODACTYL[0],
                type: 'bird',
            };
        } else {
            const isBig = Math.random() > 0.5;
            const group = isBig ? CACTUS_BIG : CACTUS_SMALL;
            const quantityIndex = Math.floor(Math.random() * group.length);
            const sprite = group[quantityIndex];
            
            obstacle = {
                x: GAME_WIDTH,
                y: GAME_HEIGHT - GROUND.h - sprite.h / 1.5,
                w: sprite.w / 1.5,
                h: sprite.h / 1.5,
                sprite: sprite,
                type: 'cactus'
            };
        }
        obstacles.push(obstacle);
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isKeyDown) return;
        e.preventDefault();
        
        if (isGameOver) {
            if (e.code === 'Space' || e.code === 'ArrowUp') resetGame();
            return;
        }

        isKeyDown = true;
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            if (p.onG && !p.isCrouching) {
                p.yv = -p.jump;
                p.onG = false;
            }
        } else if (e.code === 'ArrowDown') {
            if (p.onG) {
               p.isCrouching = true;
            }
        }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
        isKeyDown = false;
        e.preventDefault();
        if (e.code === 'ArrowDown') {
            p.isCrouching = false;
        }
    };
    
    const handleStartClick = () => {
         if (isGameOver) {
            resetGame();
        } else if (p.onG && !p.isCrouching) {
            p.yv = -p.jump;
            p.onG = false;
        }
    };

    const handleReviveClick = () => {
        if (gameOver && !hasRevived) {
            reviveGame();
        }
    };
    
    function init() {
        if (!spriteImgRef.current) {
            spriteImgRef.current = new Image();
            spriteImgRef.current.src = SPRITE_SHEET_URL;
            spriteImgRef.current.onload = () => {
                console.log("Sprite sheet loaded.");
                ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                const groundY = GAME_HEIGHT - GROUND.h;
                ctx.drawImage(spriteImgRef.current!, GROUND.x, GROUND.y, GROUND.w, GROUND.h, 0, groundY, GROUND.w, GROUND.h);
                ctx.drawImage(spriteImgRef.current!, DINO_IDLE.x, DINO_IDLE.y, DINO_IDLE.w, DINO_IDLE.h, p.x, groundY - p.h, p.w, p.h);
            };
            spriteImgRef.current.onerror = () => {
                console.error("Failed to load sprite sheet.");
            };
        } else {
             if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        const startButton = document.getElementById('startButton');
        const reviveButton = document.getElementById('reviveButton');

        if(startButton) startButton.addEventListener('click', handleStartClick);
        if(reviveButton) reviveButton.addEventListener('click', handleReviveClick);

        canvas.addEventListener('click', handleStartClick);
        canvas.addEventListener('touchstart', handleStartClick);

        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if(startButton) startButton.removeEventListener('click', handleStartClick);
            if(reviveButton) reviveButton.removeEventListener('click', handleReviveClick);
            canvas.removeEventListener('click', handleStartClick);
            canvas.removeEventListener('touchstart', handleStartClick);
        };
    }
    
    return init();

  }, [highScore, gameOver, hasRevived]); // Add gameOver and hasRevived to dependencies

  useEffect(() => {
    const cleanup = startGame();
    return cleanup;
  }, [startGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground p-4">
        <Button asChild variant="outline" className="absolute top-4 left-4 z-20">
            <Link href="/arcade">Volver al Arcade</Link>
        </Button>
      <Card className="w-full max-w-[850px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Skull /> Dino Run</span>
            <div className="text-right text-lg">
                <span>HS: {Math.floor(highScore / 10)}</span>
                <span className="ml-4">Score: {Math.floor(score / 10)}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-muted rounded-md overflow-hidden"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT, cursor: 'pointer' }}
          >
             {!gameStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
                <h2 className="text-4xl font-bold mb-4">Dino Run</h2>
                <p className="mb-8 max-w-xs">Usa [Espacio] o [↑] para saltar y [↓] para agacharte. ¡Esquiva los obstáculos!</p>
                <Button id="startButton">Empezar a Jugar</Button>
              </div>
            )}
            
            {gameOver && gameStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 gap-4">
                 <img src={SPRITE_SHEET_URL} alt="Game Over" style={{ objectFit: 'none', objectPosition: `-${GAME_OVER_TEXT.x}px -${GAME_OVER_TEXT.y}px`, width: `${GAME_OVER_TEXT.w}px`, height: `${GAME_OVER_TEXT.h}px`, imageRendering: 'pixelated', transform: 'scale(0.8)' }} />
                 <div className="flex gap-4">
                    <Button id="startButton" variant="secondary">Jugar de Nuevo</Button>
                    <Button id="reviveButton" disabled={hasRevived}>
                        <HeartPulse className="mr-2 h-4 w-4" />
                        {hasRevived ? 'Ya has revivido' : 'Revivir (Ver Anuncio)'}
                    </Button>
                 </div>
              </div>
            )}

            <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                className="absolute top-0 left-0"
                style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </CardContent>
      </Card>
      <AdPlaceholder />
    </div>
  );
}
