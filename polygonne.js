import { throttle, debounce } from "../libs/utils.js";
import { rand, easings } from "../libs/utils.js";

class Polygonne {
    constructor(options) {
        
        if(!options)         throw new Error("Options not provided !");
        if(!options.wrapper) throw new Error("Wrapper not provided !");
        if(!options.width)   throw new Error("Width not provided !");
        if(!options.height)  throw new Error("Height not provided !");

        this.wrapper   = options.wrapper;
        this.width     = options.width;
        this.height    = options.height;
        this.color     = options.color || "#dddddd";
        this.points    = options.points || 3;
        this.positions = [];
        
        if(options.positions) this.positions = options.positions;
        else {

            for(let i = 0; i < this.points; i++) {

                this.positions.push({
                    x: rand(0, this.width),
                    y: rand(0, this.height)
                });
            }

        }

        this.duration = options.duration || 1500;


        this.state = {
            points: this.positions
        };

        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.wrapper.appendChild(this.canvas);

        this.play();
    }

    moveTo(positions) {
        
        this.params = {
            startTime: performance.now(),
            start: this.state.points,
            end: positions
        };

        this.changeState();

    }

    changeState() {

        const now = performance.now();
        const progress = (now - this.params.startTime) / this.duration;
        
        const newPositions = this.params.end.map((el, i) => {

            const x = (easings.easeInOutQuint(progress) * (el.x - this.params.start[i].x)) + this.params.start[i].x;
            const y = (easings.easeInOutQuint(progress) * (el.y - this.params.start[i].y)) + this.params.start[i].y;

            return {
                x,
                y
            };

        });

        this.state.points = newPositions;

        if(now - this.params.startTime < this.duration) requestAnimationFrame(this.changeState.bind(this));

    }

    play() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.state.points[0].x, this.state.points[0].y);
        for(let i = 1; i < this.points; i++) {
            this.ctx.lineTo(this.state.points[i].x, this.state.points[i].y);
        }
        //this.ctx.lineTo(this.state.points[2].x, this.state.points[2].y);
        this.ctx.closePath();
        this.ctx.fill();


        this.raf = requestAnimationFrame(this.play.bind(this));
    }

    pause() {
        cancelAnimationFrame(this.raf);
    }

}

export default Polygonne;
