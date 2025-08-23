import React, { useRef, useEffect } from 'react';

// A self-contained Perlin noise generator.
const PerlinNoise = new (function () {
    this.noise = function (x: number, y: number, z: number = 0) {
        const p = new Array(512);
        const permutation = [ 151,160,137,91,90,15,
        131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
        190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
        88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
        77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
        102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
        135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
        5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
        223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
        129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
        251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
        49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
        138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
        ];
        for (let i=0; i < 256 ; i++) p[256+i] = p[i] = permutation[i];

        let X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        
        let u = this.fade(x), v = this.fade(y), w = this.fade(z);
        let A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

        return this.scale(this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA], x, y, z), this.grad(p[BA], x-1, y, z)),
                                         this.lerp(u, this.grad(p[AB], x, y-1, z), this.grad(p[BB], x-1, y-1, z))),
                                this.lerp(v, this.lerp(u, this.grad(p[AA+1], x, y, z-1), this.grad(p[BA+1], x-1, y, z-1)),
                                         this.lerp(u, this.grad(p[AB+1], x, y-1, z-1), this.grad(p[BB+1], x-1, y-1, z-1)))));
    }
    this.fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    this.lerp = (t: number, a: number, b: number) => a + t * (b - a);
    this.grad = (hash: number, x: number, y: number, z: number) => {
        let h = hash & 15;
        let u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    this.scale = (n: number) => (1 + n) / 2;
})();

const NoiseBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const noise = PerlinNoise;
        const noiseScale = 0.003;
        const amplitude = 100;
        const lineDensity = 15;
        const lineStrokeWeight = 1;
        const strokeColor = 'rgba(147, 51, 234, 0.4)';

        const setup = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineStrokeWeight;
            ctx.lineJoin = 'round';
            ctx.globalAlpha = 0; // Start transparent for fade-in
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            mousePos.current = { x: event.clientX, y: event.clientY };
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fade in animation
            if (ctx.globalAlpha < 1) {
                ctx.globalAlpha += 0.01;
            }

            const timeX = (mousePos.current.x / canvas.clientWidth) * 10;
            const timeY = (mousePos.current.y / canvas.clientHeight) * 10;

            for (let y = -lineDensity; y < canvas.clientHeight + lineDensity; y += lineDensity) {
                ctx.beginPath();
                let isFirstPoint = true;
                for (let x = -5; x <= canvas.clientWidth + 5; x += 5) {
                    const noiseVal = noise.noise(x * noiseScale + timeX, y * noiseScale + timeY, 0);
                    const yOffset = (noiseVal - 0.5) * amplitude * 2;
                    if (isFirstPoint) {
                        ctx.moveTo(x, y + yOffset);
                        isFirstPoint = false;
                    } else {
                        ctx.lineTo(x, y + yOffset);
                    }
                }
                ctx.stroke();
            }
            animationFrameId.current = window.requestAnimationFrame(render);
        };
        
        setup();
        render();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', setup);
        
        return () => {
            if(animationFrameId.current) window.cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', setup);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />;
};

export default NoiseBackground;