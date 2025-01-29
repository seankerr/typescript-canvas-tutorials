export type Media = {
    image: HTMLImageElement;
    height: number;
    width: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
};

export class World {
    canvas: HTMLCanvasElement = null!;
    ctx: CanvasRenderingContext2D = null!;
    media: Media = null!;
    ready: boolean = false;

    constructor() {
        this.canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
        this.ctx = this.canvas.getContext("2d")!;

        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));

        this.reset();
    }

    applyTransformations() {
        this.media.x += this.media.vx;
        this.media.y += this.media.vy;

        if (this.media.x < 0) this.media.x = 0;
        if (this.media.y < 0) this.media.y = 0;

        if (this.media.x + this.media.width > this.canvas.width) {
            this.media.x = this.canvas.width - this.media.width;
        }

        if (this.media.y + this.media.height > this.canvas.height) {
            this.media.y = this.canvas.height - this.media.height;
        }
    }

    drawMessage() {
        this.ctx.font = "12px system-ui";
        this.ctx.fillText("Use the arrow keys to move the image", 5, 15);
    }

    drawImage() {
        this.ctx.drawImage(
            this.media.image,
            this.media.x,
            this.media.y,
            this.media.width,
            this.media.height
        );
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === "ArrowLeft") this.media.vx = -1.5;
        if (event.key === "ArrowRight") this.media.vx = 1.5;
        if (event.key === "ArrowDown") this.media.vy = 1.5;
        if (event.key === "ArrowUp") this.media.vy = -1.5;
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.key === "ArrowLeft") this.media.vx = 0;
        if (event.key === "ArrowRight") this.media.vx = 0;
        if (event.key === "ArrowDown") this.media.vy = 0;
        if (event.key === "ArrowUp") this.media.vy = 0;
    }

    reset() {
        this.ready = false;

        const width = 90;
        const height = 120;

        this.media = {
            image: new Image(width, height),
            height: height,
            width: width,
            x: this.canvas.width / 2 - width / 2,
            y: this.canvas.height / 2 - height / 2,
            vx: 0,
            vy: 0,
        };

        this.media.image.onload = () => (this.ready = true);
        this.media.image.src = "/bob-omb.png";
    }

    update() {
        if (!this.ready) {
            window.requestAnimationFrame(this.update.bind(this));
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.applyTransformations();
        this.drawMessage();
        this.drawImage();

        window.requestAnimationFrame(this.update.bind(this));
    }
}

const world = new World();

window.requestAnimationFrame(world.update.bind(world));
