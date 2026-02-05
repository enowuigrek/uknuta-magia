import { useEffect, useRef, useCallback } from 'react';
import styles from './MagicParticles.module.scss';

const PARTICLE_COUNT = 40;
const COLORS = [
    'rgba(226, 194, 117, 0.6)',  // gold
    'rgba(226, 194, 117, 0.3)',  // gold dim
    'rgba(50, 151, 196, 0.5)',   // magic glow
    'rgba(50, 151, 196, 0.25)',  // magic glow dim
    'rgba(255, 255, 255, 0.4)',  // white sparkle
];

function createParticle(width, height) {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1,
        opacity: Math.random() * 0.7 + 0.1,
        opacitySpeed: (Math.random() - 0.5) * 0.008,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
    };
}

export function MagicParticles() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);

        particlesRef.current.forEach((p) => {
            // Ruch
            p.x += p.speedX;
            p.y += p.speedY;
            p.twinklePhase += p.twinkleSpeed;

            // Migotanie
            const twinkle = Math.sin(p.twinklePhase) * 0.5 + 0.5;
            const currentOpacity = p.opacity * twinkle;

            // Delikatne odpychanie od kursora
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150 * 0.5;
                p.x += (dx / dist) * force;
                p.y += (dy / dist) * force;
            }

            // Reset jeśli wyszedł poza ekran
            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            // Rysowanie iskierki ze świeceniem
            ctx.save();
            ctx.globalAlpha = currentOpacity;

            // Glow
            ctx.shadowBlur = p.size * 4;
            ctx.shadowColor = p.color;

            // Kształt gwiazdy (mała)
            ctx.fillStyle = p.color;
            ctx.beginPath();

            if (p.size > 1.5) {
                // Większe cząsteczki jako 4-ramienne gwiazdki
                const s = p.size;
                ctx.moveTo(p.x, p.y - s * 1.5);
                ctx.quadraticCurveTo(p.x + s * 0.3, p.y - s * 0.3, p.x + s * 1.5, p.y);
                ctx.quadraticCurveTo(p.x + s * 0.3, p.y + s * 0.3, p.x, p.y + s * 1.5);
                ctx.quadraticCurveTo(p.x - s * 0.3, p.y + s * 0.3, p.x - s * 1.5, p.y);
                ctx.quadraticCurveTo(p.x - s * 0.3, p.y - s * 0.3, p.x, p.y - s * 1.5);
            } else {
                // Mniejsze jako kółka
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }

            ctx.fill();
            ctx.restore();
        });

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Inicjalizuj cząsteczki
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
            createParticle(canvas.width, canvas.height)
        );

        // Śledzenie myszy (pozycja na stronie, nie viewport)
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.pageX,
                y: e.pageY,
            };
        };
        document.addEventListener('mousemove', handleMouseMove);

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate]);

    return <canvas ref={canvasRef} className={styles.magicCanvas} />;
}
