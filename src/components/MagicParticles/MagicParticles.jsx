import { useEffect, useRef, useCallback } from 'react';
import styles from './MagicParticles.module.scss';

const PARTICLE_COUNT = 50;
const COLORS = [
    'rgba(226, 194, 117, 0.9)',   // gold bright
    'rgba(226, 194, 117, 0.6)',   // gold
    'rgba(255, 255, 255, 0.9)',   // white bright
    'rgba(255, 255, 255, 0.6)',   // white
    'rgba(200, 180, 255, 0.7)',   // lavender
    'rgba(50, 151, 196, 0.6)',    // magic glow
];

function createParticle(width, height) {
    const isLarge = Math.random() > 0.7; // 30% dużych iskier
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isLarge ? Math.random() * 4 + 2 : Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        isLarge,
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
            const currentOpacity = p.opacity * (0.5 + twinkle * 0.5);

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

            // Rysowanie iskierki
            ctx.save();
            ctx.globalAlpha = currentOpacity;

            // Glow - większy dla dużych iskier
            ctx.shadowBlur = p.isLarge ? p.size * 8 : p.size * 4;
            ctx.shadowColor = p.color;

            ctx.fillStyle = p.color;
            ctx.beginPath();

            if (p.isLarge) {
                // Duże iskry jako 4-ramienne gwiazdki
                const s = p.size;
                ctx.moveTo(p.x, p.y - s * 2);
                ctx.quadraticCurveTo(p.x + s * 0.4, p.y - s * 0.4, p.x + s * 2, p.y);
                ctx.quadraticCurveTo(p.x + s * 0.4, p.y + s * 0.4, p.x, p.y + s * 2);
                ctx.quadraticCurveTo(p.x - s * 0.4, p.y + s * 0.4, p.x - s * 2, p.y);
                ctx.quadraticCurveTo(p.x - s * 0.4, p.y - s * 0.4, p.x, p.y - s * 2);
            } else {
                // Mniejsze jako kółka
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }

            ctx.fill();

            // Dodatkowy jasny punkt w środku dla dużych iskier
            if (p.isLarge) {
                ctx.globalAlpha = currentOpacity * 1.2;
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Inicjalizuj cząsteczki
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
            createParticle(canvas.width, canvas.height)
        );

        // Śledzenie myszy
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY,
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
