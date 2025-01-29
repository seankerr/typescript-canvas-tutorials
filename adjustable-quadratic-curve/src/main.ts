export type QuadraticCurve = {
    controlX: number;
    controlY: number;
    endX: number;
    endY: number;
    size: number;
    startX: number;
    startY: number;
};

export type Mouse = {
    isDown: boolean;
    offsetX: number;
    offsetY: number;
};

export class World {
    curve: QuadraticCurve = null!;
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

    onMouseDown(event: MouseEvent) {
        const [mouseX, mouseY] = this.mouseToCanvasCoords(
            event.clientX,
            event.clientY
        );

        if (
            mouseX >= this.curve.controlX - this.curve.size / 2 &&
            mouseX <= this.curve.controlX + this.curve.size / 2 &&
            mouseY >= this.curve.controlY - this.curve.size / 2 &&
            mouseY <= this.curve.controlY + this.curve.size / 2
        ) {
            this.mouse.offsetX = mouseX - this.curve.controlX;
            this.mouse.offsetY = mouseY - this.curve.controlY;
            this.mouse.isDown = true;
        }
    }

    onMouseMove(event: MouseEvent) {
        if (!this.mouse.isDown) return;

        const [mouseX, mouseY] = this.mouseToCanvasCoords(
            event.clientX,
            event.clientY
        );

        let controlX = mouseX - this.mouse.offsetX;
        let controlY = mouseY - this.mouse.offsetY;

        if (controlX < this.curve.size / 2) {
            controlX = this.curve.size / 2;
        }

        if (controlY < this.curve.size / 2) {
            controlY = this.curve.size / 2;
        }

        if (controlX + this.curve.size / 2 > this.canvas.width) {
            controlX = this.canvas.width - this.curve.size / 2;
        }

        if (controlY + this.curve.size / 2 > this.canvas.height) {
            controlY = this.canvas.height - this.curve.size / 2;
        }

        this.curve.controlX = controlX;
        this.curve.controlY = controlY;
    }

    mouseToCanvasCoords(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect();

        return [clientX - rect.left, clientY - rect.top];
    }

    drawQuadraticCurve() {
        // curve
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#000";
        this.ctx.beginPath();
        this.ctx.setLineDash([]);
        this.ctx.moveTo(this.curve.startX, this.curve.startY);
        this.ctx.quadraticCurveTo(
            this.curve.controlX,
            this.curve.controlY,
            this.curve.endX,
            this.curve.endY
        );
        this.ctx.stroke();

        // start point to control point
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#AAA";
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 5]);
        this.ctx.moveTo(this.curve.startX, this.curve.startY);
        this.ctx.lineTo(this.curve.controlX, this.curve.controlY);
        this.ctx.stroke();

        // end point to control point
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#AAA";
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 5]);
        this.ctx.moveTo(this.curve.endX, this.curve.endY);
        this.ctx.lineTo(this.curve.controlX, this.curve.controlY);
        this.ctx.stroke();

        // start point
        this.ctx.fillStyle = "#00F";
        this.ctx.fillRect(this.curve.startX - 5, this.curve.startY - 5, 10, 10);

        // end point
        this.ctx.fillRect(this.curve.endX - 5, this.curve.endY - 5, 10, 10);

        // control point
        this.ctx.fillStyle = "#F00";
        this.ctx.fillRect(
            this.curve.controlX - 5,
            this.curve.controlY - 5,
            10,
            10
        );
    }

    reset() {
        this.curve = {
            controlX: 500,
            controlY: 150,
            endX: 600,
            endY: 500,
            size: 10,
            startX: 200,
            startY: 100,
        };

        this.mouse = {
            isDown: false,
            offsetX: 0,
            offsetY: 0,
        };
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawQuadraticCurve();

        window.requestAnimationFrame(this.update.bind(this));
    }
}

const world = new World();

window.requestAnimationFrame(world.update.bind(world));
