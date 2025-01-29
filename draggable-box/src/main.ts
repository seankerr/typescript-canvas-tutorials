export type Box = {
    height: number;
    width: number;
    x: number;
    y: number;
};

export type Mouse = {
    isDown: boolean;
    offsetX: number;
    offsetY: number;
};

export class World {
    box: Box = null!;
    canvas: HTMLCanvasElement = null!;
    ctx: CanvasRenderingContext2D = null!;
    mouse: Mouse = null!;

    constructor() {
        this.canvas = document.querySelector<HTMLCanvasElement>("canvas")!;
        this.ctx = this.canvas.getContext("2d")!;

        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("mouseup", () => (this.mouse.isDown = false));

        this.reset();
    }

    drawBox() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#F00";
        this.ctx.strokeRect(
            this.box.x,
            this.box.y,
            this.box.width,
            this.box.height
        );
    }

    onMouseDown(event: MouseEvent) {
        const [mouseX, mouseY] = this.mouseToCanvasCoords(
            event.clientX,
            event.clientY
        );

        if (
            mouseX >= this.box.x &&
            mouseX <= this.box.x + this.box.width &&
            mouseY >= this.box.y &&
            mouseY <= this.box.y + this.box.height
        ) {
            this.mouse.offsetX = mouseX - this.box.x;
            this.mouse.offsetY = mouseY - this.box.y;
            this.mouse.isDown = true;
        } else {
            this.reset();
        }
    }

    onMouseMove(event: MouseEvent) {
        if (!this.mouse.isDown) return;

        const [mouseX, mouseY] = this.mouseToCanvasCoords(
            event.clientX,
            event.clientY
        );

        let boxX = mouseX - this.mouse.offsetX;
        let boxY = mouseY - this.mouse.offsetY;

        if (boxX < 0) boxX = 0;
        if (boxY < 0) boxY = 0;

        if (boxX + this.box.width > this.canvas.width) {
            boxX = this.canvas.width - this.box.width;
        }

        if (boxY + this.box.height > this.canvas.height) {
            boxY = this.canvas.height - this.box.height;
        }

        this.box.x = boxX;
        this.box.y = boxY;
    }

    mouseToCanvasCoords(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect();

        return [clientX - rect.left, clientY - rect.top];
    }

    reset() {
        const size = 100;

        this.box = {
            height: size,
            width: size,
            x: this.canvas.width / 2 - size / 2,
            y: this.canvas.height / 2 - size / 2,
        };

        this.mouse = {
            isDown: false,
            offsetX: 0,
            offsetY: 0,
        };
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBox();

        window.requestAnimationFrame(this.update.bind(this));
    }
}

const world = new World();

window.requestAnimationFrame(world.update.bind(world));
