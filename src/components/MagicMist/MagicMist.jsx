import { useEffect, useRef } from 'react';
import styles from './MagicMist.module.scss';

export function MagicMist() {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Ciemne fioletowe fale - tylko na dole strony
        const waves = [
            {
                amplitude: 80,
                frequency: 0.002,
                speed: 0.0004,
                yOffset: 0.75,  // nisko
                color: 'rgba(40, 20, 60, 0.4)',  // ciemny fiolet
                blur: 80
            },
            {
                amplitude: 100,
                frequency: 0.0015,
                speed: 0.0003,
                yOffset: 0.85,  // bardzo nisko
                color: 'rgba(50, 25, 75, 0.35)', // ciemny fiolet
                blur: 100
            },
            {
                amplitude: 60,
                frequency: 0.003,
                speed: 0.0005,
                yOffset: 0.9,  // prawie na dole
                color: 'rgba(35, 15, 55, 0.3)',  // bardzo ciemny fiolet
                blur: 60
            },
        ];

        const drawMist = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            waves.forEach((wave) => {
                ctx.save();
                ctx.filter = `blur(${wave.blur}px)`;
                ctx.fillStyle = wave.color;
                ctx.beginPath();

                const baseY = height * wave.yOffset;
                ctx.moveTo(0, height);

                for (let x = 0; x <= width; x += 5) {
                    const y = baseY +
                        Math.sin(x * wave.frequency + timeRef.current * wave.speed) * wave.amplitude +
                        Math.sin(x * wave.frequency * 1.5 + timeRef.current * wave.speed * 0.7) * wave.amplitude * 0.5;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            });

            timeRef.current += 16;
            animationRef.current = requestAnimationFrame(drawMist);
        };

        drawMist();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.mistCanvas} />;
}
