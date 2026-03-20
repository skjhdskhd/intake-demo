'use client';
import { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';

interface FallingTextProps {
  className?: string;
  text?: string;
  highlightWords?: string[];
  highlightClass?: string;
  trigger?: 'scroll' | 'click' | 'hover' | 'auto';
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
}

export default function FallingText({
  className = '',
  text = '',
  highlightWords = [],
  highlightClass = '',
  trigger = 'scroll',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 0.8,
  mouseConstraintStiffness = 0.2,
  fontSize = '1.25rem',
}: FallingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [effectStarted, setEffectStarted] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');
    textRef.current.innerHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        return `<span class="falling-word ${isHighlighted ? highlightClass : ''}" style="display:inline-block;margin:4px 6px;cursor:default;">${word}</span>`;
      })
      .join(' ');
  }, [text, highlightWords, highlightClass]);

  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true);
      return;
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted) return;
    if (!containerRef.current || !textRef.current || !canvasContainerRef.current) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;
    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: { width, height, background: backgroundColor, wireframes },
    });

    const bo = { isStatic: true, render: { fillStyle: 'transparent' } };
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, bo);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, bo);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, bo);
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, bo);

    const wordSpans = textRef.current.querySelectorAll<HTMLSpanElement>('.falling-word');
    const wordBodies = [...wordSpans].map((elem) => {
      const rect = elem.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: 'transparent' },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      });
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      return { elem, body };
    });

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = 'absolute';
      elem.style.left = `${body.position.x}px`;
      elem.style.top = `${body.position.y}px`;
      elem.style.transform = 'translate(-50%,-50%)';
    });

    const mouse = Mouse.create(containerRef.current);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: mouseConstraintStiffness, render: { visible: false } },
    });
    (render as Matter.Render & { mouse: Matter.Mouse }).mouse = mouse;

    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mc, ...wordBodies.map((wb) => wb.body)]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    let animRaf: number;
    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        elem.style.left = `${body.position.x}px`;
        elem.style.top = `${body.position.y}px`;
        elem.style.transform = `translate(-50%,-50%) rotate(${body.angle}rad)`;
      });
      animRaf = requestAnimationFrame(updateLoop);
    };
    animRaf = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animRaf);
      Render.stop(render);
      Runner.stop(runner);
      try { canvasContainerRef.current?.removeChild(render.canvas); } catch {}
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  return (
    <div
      ref={containerRef}
      className={className}
      onClick={trigger === 'click' ? () => !effectStarted && setEffectStarted(true) : undefined}
      onMouseEnter={trigger === 'hover' ? () => !effectStarted && setEffectStarted(true) : undefined}
      style={{ position: 'relative', overflow: 'hidden', minHeight: '300px' }}
    >
      <div ref={textRef} style={{ fontSize, lineHeight: 1.4, position: 'relative', zIndex: 1 }} />
      <div ref={canvasContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
    </div>
  );
}
