"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type FooterCrowdProps = {
  reduceMotion?: boolean;
};

type Peep = {
  image: HTMLImageElement;
  rect: [number, number, number, number];
  frameWidth: number;
  frameHeight: number;
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: 1 | -1;
  walk?: gsap.core.Timeline;
  render: (context: CanvasRenderingContext2D) => void;
};

const ROWS = 15;
const COLS = 7;

export function FooterCrowd({ reduceMotion = false }: FooterCrowdProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let disposed = false;
    const stage = { width: 0, height: 0, scale: 0.5 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const randomIndex = (items: Peep[]) =>
      Math.floor(Math.random() * items.length);

    const createPeep = (
      image: HTMLImageElement,
      rect: [number, number, number, number],
    ): Peep => {
      const peep: Peep = {
        image,
        rect,
        frameWidth: rect[2],
        frameHeight: rect[3],
        width: rect[2] * stage.scale,
        height: rect[3] * stage.scale,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        render: (drawContext) => {
          drawContext.save();
          drawContext.translate(peep.x, peep.y);
          drawContext.scale(peep.scaleX, 1);
          drawContext.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          drawContext.restore();
        },
      };

      return peep;
    };

    const resetPeep = (peep: Peep) => {
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 16 - 52 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width + peep.width : -peep.width;

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      peep.scaleX = direction;

      return { startX, startY, endX };
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return;

      const peep = availablePeeps.splice(randomIndex(availablePeeps), 1)[0];
      const props = resetPeep(peep);
      const walk = gsap
        .timeline({
          onComplete: () => {
            const crowdIndex = crowd.indexOf(peep);
            if (crowdIndex >= 0) crowd.splice(crowdIndex, 1);
            availablePeeps.push(peep);
            addPeepToCrowd();
          },
        })
        .timeScale(randomRange(0.55, 1.25));

      walk.to(peep, { duration: 11, x: props.endX, ease: "none" }, 0);
      walk.to(
        peep,
        {
          duration: 0.3,
          repeat: 11 / 0.3,
          yoyo: true,
          y: props.startY - 4,
          ease: "sine.inOut",
        },
        0,
      );

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((first, second) => first.anchorY - second.anchorY);
    };

    const initCrowd = () => {
      if (reduceMotion) {
        const staticPeeps = allPeeps.slice(0, Math.min(8, allPeeps.length));
        staticPeeps.forEach((peep, index) => {
          peep.x = (stage.width / (staticPeeps.length + 1)) * (index + 1);
          peep.y = stage.height - peep.height;
          peep.anchorY = peep.y;
          peep.scaleX = index % 2 ? -1 : 1;
          crowd.push(peep);
        });
        return;
      }

      while (availablePeeps.length) {
        addPeepToCrowd();
      }

      crowd.forEach((peep) => {
        peep.walk?.progress(Math.random());
      });
    };

    const render = () => {
      if (disposed) return;
      context.clearRect(0, 0, stage.width, stage.height);
      crowd.forEach((peep) => peep.render(context));
    };

    const resize = () => {
      if (disposed) return;

      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      stage.scale = Math.min(0.68, Math.max(0.35, stage.height / 390));
      canvas.width = Math.max(1, Math.round(stage.width * window.devicePixelRatio));
      canvas.height = Math.max(1, Math.round(stage.height * window.devicePixelRatio));
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      allPeeps.forEach((peep) => {
        peep.width = peep.frameWidth * stage.scale;
        peep.height = peep.frameHeight * stage.scale;
      });

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);
      initCrowd();
      render();
    };

    const image = new Image();
    image.onload = () => {
      if (disposed) return;

      const frameWidth = image.naturalWidth / ROWS;
      const frameHeight = image.naturalHeight / COLS;

      for (let index = 0; index < ROWS * COLS; index += 1) {
        allPeeps.push(
          createPeep(image, [
            (index % ROWS) * frameWidth,
            Math.floor(index / ROWS) * frameHeight,
            frameWidth,
            frameHeight,
          ]),
        );
      }

      resize();
      if (!reduceMotion) gsap.ticker.add(render);
    };
    image.src = "/images/peeps/all-peeps.png";

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[170px] w-full opacity-[0.24] sm:h-[205px] md:h-[235px]"
    />
  );
}
