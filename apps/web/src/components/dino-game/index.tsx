"use client";
/* eslint-disable @next/next/no-img-element -- we're doing some very custom stuff here */
import type { StaticImageData } from "next/image";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import ErrorImage from "../../assets/DinoGame/Error.svg";
import RestartImage from "../../assets/DinoGame/Restart.svg";
import StandImage from "../../assets/DinoGame/Stand.svg";
import TaxiImage from "../../assets/DinoGame/Taxi.svg";
import WalkImage1 from "../../assets/DinoGame/Walk1.svg";
import WalkImage2 from "../../assets/DinoGame/Walk2.svg";

interface LoadedImages {
  stand: HTMLImageElement;
  walk1: HTMLImageElement;
  walk2: HTMLImageElement;
  error: HTMLImageElement;
  taxi: HTMLImageElement;
  restart: HTMLImageElement;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
}

interface Point {
  x: number;
  y: number;
}

class HitBox {
  width: number;

  height: number;

  bottomLeft: Point;

  constructor(width: number, height: number, bottomLeft: Point) {
    this.width = width;
    this.height = height;
    this.bottomLeft = bottomLeft;
  }

  get minX() {
    return this.bottomLeft.x;
  }

  get minY() {
    return this.bottomLeft.y;
  }

  get maxX() {
    return this.bottomLeft.x + this.width;
  }

  get maxY() {
    return this.bottomLeft.y + this.height;
  }

  overlaps(other: HitBox) {
    const xCollide = this.minX <= other.maxX && this.maxX >= other.minX;
    const yCollide = this.minY <= other.maxY && this.maxY >= other.minY;
    return xCollide && yCollide;
  }
}

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jumpEventReceived = useRef(false);
  const [startCount, setStartCount] = useState(0);
  const hasStarted = startCount > 0;
  const isRestart = startCount > 1;
  const [hasEnded, setHasEnded] = useState(false);
  const [images, setImages] = useState<LoadedImages>();

  const loadImage = async (src: string) => {
    const img = document.createElement("img");
    img.src = src;
    return new Promise<HTMLImageElement>((resolve, reject) => {
      img.addEventListener("load", () => {
        resolve(img);
      });
      img.addEventListener("error", (e) => {
        reject(new Error(e.message));
      });
    });
  };

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = {
        stand: await loadImage((StandImage as StaticImageData).src),
        walk1: await loadImage((WalkImage1 as StaticImageData).src),
        walk2: await loadImage((WalkImage2 as StaticImageData).src),
        error: await loadImage((ErrorImage as StaticImageData).src),
        taxi: await loadImage((TaxiImage as StaticImageData).src),
        restart: await loadImage((RestartImage as StaticImageData).src),
      };
      setImages(loadedImages);
    };
    void loadImages();
  }, []);

  const jump = () => {
    jumpEventReceived.current = true;
  };

  const doAction = () => {
    // Jump when game running or starting first game
    if (!hasEnded) jump();
    // (Re)start game if not running
    if (!hasStarted || hasEnded) {
      setStartCount(startCount + 1);
      setHasEnded(false);
    }
  };

  const handleClick = () => {
    doAction();
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === " " || event.key === "ArrowUp" || event.key === "w") {
      event.preventDefault();
      doAction();
    }
  };

  useEffect(() => {
    if (!images) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    /** sec */
    const maxTimeFromPressToJump = 0.5;

    /** px/s^2 */
    const gravity = 1000;
    /** px/s */
    const maxFallSpeed = -1200;
    /** px/s */
    const jumpSpeed = 600;

    /** px, from right side of canvas */
    const minimumSpaceForNewObstacle = 500;

    /** px/s */
    const initialObstacleSpeed = 300;
    /** px/s */
    const maxObstacleSpeed = 660;
    /** px/s^2 */
    const obstacleAcceleration = 7.2;

    /** 1/s */
    const pointsPerSecond = 4;

    /** px */
    const playerHeight = 120;
    /** px */
    const groundHeight = 30;

    /** sec, for player walking animation */
    const initialFrameDuration = 0.25;

    /** sec */
    const maxDeltaTime = 0.25;

    const obstacleTypes = [
      { targetHeight: 130, image: images.error },
      { targetHeight: 75, image: images.taxi },
    ];

    /** ms, from epoch */
    let lastFrame = Date.now();
    /** sec, from start */
    let time = 0;
    /** sec, from start */
    let lastJumpEvent = 0;
    /** px */
    let playerY = 0;
    /** px/s */
    let playerYSpeed = 0;
    /** px/s */
    let obstacleSpeed = initialObstacleSpeed;

    let gameHasEnded = false;
    let visibleAreaWidth = isRestart ? canvas.width : 160;

    let obstacles: Obstacle[] = [];
    let groundSpecks: Point[] = [];

    const getScaledImageDimensions = (
      image: HTMLImageElement,
      targetHeight: number,
    ) => {
      const multiplier = targetHeight / image.height;
      const scaledWidth = image.width * multiplier;
      const scaledHeight = image.height * multiplier;
      return [scaledWidth, scaledHeight];
    };

    const createSpeck = (x?: number): Point => {
      return {
        x: x ?? canvas.width,
        y: Math.random() * groundHeight,
      };
    };

    const createObstacle = (): Obstacle => {
      const { image, targetHeight } =
        obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      const [width, height] = getScaledImageDimensions(image, targetHeight);
      const minDistanceFromScreenEdge = 250;
      const distanceVariation = 100;
      const minDistanceFromGroundLine = 5;
      return {
        x:
          canvas.width +
          Math.random() * distanceVariation +
          minDistanceFromScreenEdge,
        y: height + Math.random() * (groundHeight - minDistanceFromGroundLine),
        width,
        height,
        image,
      };
    };

    for (let i = 0; i <= canvas.width; i += 1) {
      if (i % 4 === 0) {
        groundSpecks.push(createSpeck(i));
      }
    }

    const drawGround = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, ctx.canvas.height - groundHeight, ctx.canvas.width, 2);
      groundSpecks.forEach((speck) => {
        ctx.fillRect(speck.x, canvas.height - speck.y, 1, 1);
      });
    };

    const drawPlayerAndReturnHitbox = () => {
      const frameDuration =
        initialFrameDuration * (initialObstacleSpeed / obstacleSpeed);
      const picIndex = Math.floor((time / frameDuration) % 4);

      const groundFrame = [
        images.stand,
        images.walk1,
        images.stand,
        images.walk2,
      ][picIndex];
      const jumpFrame = images.stand;
      const frame = playerY === 0 ? groundFrame : jumpFrame;

      const [width, height] = getScaledImageDimensions(frame, playerHeight);
      const distanceFromBottom = 10;
      const isStanding = frame === images.stand;
      // Animation looks better when standing frame is offset
      const x = isStanding ? 50 + width / 4 : 50;
      const canvasY =
        canvas.height - playerHeight - playerY - distanceFromBottom;

      ctx.drawImage(frame, x, canvasY, width, height);
      return new HitBox(width, height, { x, y: canvasY });
    };

    const drawObstaclesAndDetectCollisions = (playerHitBox: HitBox) => {
      obstacles.forEach(({ width, height, x, y, image }) => {
        const canvasY = canvas.height - y;
        const hitBox = new HitBox(width, height, { x, y: canvasY });
        if (hitBox.overlaps(playerHitBox) && !gameHasEnded) {
          setHasEnded(true);
          gameHasEnded = true;
        }
        ctx.drawImage(image, x, canvasY, width, height);
      });
    };

    const drawScore = () => {
      const score = time * pointsPerSecond;
      ctx.fillStyle = "black";
      ctx.font = "40px VT323";
      const digits = 5;
      const scoreText = score.toFixed(0).padStart(digits, "0");
      ctx.fillText(scoreText, ctx.canvas.width - 100, 40);
    };

    const drawGameOverText = () => {
      const gameOverText = "GAME OVER";
      ctx.font = "40px VT323";
      ctx.fillText(
        gameOverText,
        ctx.canvas.width / 2 - ctx.measureText(gameOverText).width / 2,
        100,
      );
    };

    const clearInvisiblePartOfGame = () => {
      ctx.clearRect(
        visibleAreaWidth,
        0,
        ctx.canvas.width - visibleAreaWidth,
        ctx.canvas.height,
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawGround();
      const playerHitBox = drawPlayerAndReturnHitbox();
      drawObstaclesAndDetectCollisions(playerHitBox);
      drawScore();
      if (gameHasEnded) {
        drawGameOverText();
      }
      if (visibleAreaWidth < canvas.width) {
        clearInvisiblePartOfGame();
        if (hasStarted) {
          visibleAreaWidth += 10;
        }
      }
    };

    const handleJumpEvents = () => {
      // Handle jump events
      if (jumpEventReceived.current) {
        lastJumpEvent = time;
      }
      jumpEventReceived.current = false;

      // Start a jump if we've recently received an event and are on ground
      const hasRecentJumpEvent = lastJumpEvent > time - maxTimeFromPressToJump;
      const onGround = playerY === 0;
      if (hasRecentJumpEvent && onGround) {
        playerYSpeed = jumpSpeed;
      }
    };

    const updatePlayer = (deltaTime: number) => {
      // Gravity
      if (playerYSpeed > maxFallSpeed) {
        playerYSpeed -= gravity * deltaTime;
      }
      // Velocity
      playerY += playerYSpeed * deltaTime;
      // Stop if on ground
      if (playerY <= 0) {
        playerY = 0;
        playerYSpeed = 0;
      }
    };

    const updateObjects = (deltaTime: number) => {
      // Speed up obstacles
      obstacleSpeed = Math.min(
        initialObstacleSpeed + time * obstacleAcceleration,
        maxObstacleSpeed,
      );

      // Move specks
      groundSpecks = groundSpecks
        .map((speck) => ({ ...speck, x: speck.x - obstacleSpeed * deltaTime }))
        // Delete specks offscreen
        .filter((speck) => speck.x > -1000);
      // Add one speck per frame
      groundSpecks.push(createSpeck());

      // Move obstacles
      obstacles = obstacles
        .map((obstacle) => ({
          ...obstacle,
          x: obstacle.x - obstacleSpeed * deltaTime,
        }))
        // Delete obstacles offscreen
        .filter((obstacle) => obstacle.x > -1000);

      // Create new obstacle if none exist or there is enough room
      const noObstacles = obstacles.length === 0;
      const lastObstacle = obstacles.at(-1);
      const farEnoughAway =
        lastObstacle &&
        lastObstacle.x < canvas.width - minimumSpaceForNewObstacle;
      if (noObstacles || farEnoughAway) {
        obstacles.push(createObstacle());
      }
    };

    let animationFrameId: number;
    const render = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastFrame) / 1000, maxDeltaTime);
      time += deltaTime;
      lastFrame = now;
      draw();
      const gameIsRunning = hasStarted && !gameHasEnded;
      if (gameIsRunning) {
        handleJumpEvents();
        updatePlayer(deltaTime);
        updateObjects(deltaTime);
        // Stop requesting frames when game is not running
        animationFrameId = window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
    // Reset game state when startCount changes
  }, [hasStarted, isRestart, startCount, images]);

  return (
    <div className="relative hidden md:flex">
      <canvas
        className="w-full p-4"
        height="310"
        onClick={handleClick}
        onKeyDown={handleKeyPress}
        ref={canvasRef}
        tabIndex={0}
        width="750"
      />
      {Boolean(hasEnded) && (
        <button
          className="h-1/12 absolute left-1/2 top-1/2 z-10 w-1/12 -translate-x-1/2 -translate-y-1/2"
          onClick={handleClick}
          type="button"
        >
          <span className="sr-only">Restart Game</span>
          <img alt="" src={(RestartImage as StaticImageData).src} />
        </button>
      )}
    </div>
  );
}
