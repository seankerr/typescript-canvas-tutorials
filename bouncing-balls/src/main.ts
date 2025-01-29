export type Ball = {
    collided: boolean;
    color: string;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
};

export class World {
    balls: Array<Ball> = null!;
    canvas: HTMLCanvasElement = null!;
    ctx: CanvasRenderingContext2D = null!;

    constructor() {
        this.canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
        this.ctx = this.canvas.getContext("2d")!;

        this.reset();

        this.canvas.addEventListener("click", () => this.reset());
    }

    applyTransformations() {
        const friction = 0.8;
        const gravity = 0.2;

        for (const ball of this.balls) {
            ball.collided = false;
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;

            // apply physics
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx *= -1;
                ball.vx *= friction;
            } else if (ball.x + ball.radius > this.canvas.width) {
                ball.x = this.canvas.width - ball.radius;
                ball.vx *= -1;
                ball.vx *= friction;
            }

            if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.vy *= -1;
                ball.vy *= friction;
            } else if (ball.y + ball.radius > this.canvas.height) {
                ball.y = this.canvas.height - ball.radius;
                ball.vy *= -1;
                ball.vy *= friction;
                ball.vx *= friction;
            }

            // detect collisions
            for (const innerBall of this.balls) {
                if (ball === innerBall) continue;

                if (
                    Math.hypot(ball.x - innerBall.x, ball.y - innerBall.y) <=
                    ball.radius + innerBall.radius
                ) {
                    ball.collided = innerBall.collided = true;
                }
            }
        }
    }

    drawBalls() {
        for (const ball of this.balls) {
            this.ctx.beginPath();
            this.ctx.fillStyle = ball.collided ? "#F00" : ball.color;
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    reset() {
        this.balls = new Array(10);

        for (let i = 0; i < this.balls.length; i++) {
            const radius = randomClamp(20, 35);
            const vx = randomClamp(3, 10);
            const vy = randomClamp(3, 10);

            this.balls[i] = {
                collided: false,
                color: randomColor(),
                radius,
                x: randomClamp(radius, this.canvas.width - radius),
                y: randomClamp(radius, this.canvas.height - radius),
                vx: Math.random() < 0.5 ? vx : -vx,
                vy: Math.random() < 0.5 ? vy : -vy,
            };
        }
    }

    update() {
        this.ctx.font = "12px sans-serif";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.applyTransformations();
        this.drawBalls();

        window.requestAnimationFrame(this.update.bind(this));
    }
}

function randomClamp(min: number, max: number) {
    return Math.min(Math.max(Math.random() * max, min), max);
}

function randomColor() {
    const r = Math.floor(Math.random() * 255).toString(16);
    const g = Math.floor(Math.random() * 255).toString(16);
    const b = Math.floor(Math.random() * 255).toString(16);

    return `#${r}${g}${b}`;
}

const world = new World();

window.requestAnimationFrame(world.update.bind(world));
