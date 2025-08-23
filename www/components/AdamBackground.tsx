import React, { useRef, useEffect } from 'react';

const AdamBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, moved: false });
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const setup = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };
        setup();

        class Particle {
            x: number;
            y: number;
            size: number;
            baseX: number;
            baseY: number;
            density: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = 'rgba(67, 97, 238, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                if (!ctx) return;
                let dx = mousePos.current.x - this.x;
                let dy = mousePos.current.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = 100;
                let force = (maxDistance - distance) / maxDistance;

                let directionX = (forceDirectionX * force * this.density);
                let directionY = (forceDirectionY * force * this.density);

                if (distance < 100 && mousePos.current.moved) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }
            }
        }

        let particles: Particle[] = [];
        const init = () => {
            particles = [];
            const particleCount = (canvas.width * canvas.height) / 20000;
            for (let i = 0; i < particleCount; i++) {
                let x = Math.random() * canvas.clientWidth;
                let y = Math.random() * canvas.clientHeight;
                particles.push(new Particle(x, y));
            }
        };
        init();

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                                   ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(67, 97, 238, ${opacityValue * 0.3})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connect();
            animationFrameId.current = requestAnimationFrame(animate);
        };
        animate();

        const handleMouseMove = (event: MouseEvent) => {
            mousePos.current = { x: event.clientX / dpr, y: event.clientY / dpr, moved: true };
        };

        const handleResize = () => {
            setup();
            init();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />;
};

export default AdamBackground;