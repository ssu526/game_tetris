export default class View {
    constructor(root, {start, rotate, moveDown, moveRight, moveLeft}){
        this.start=start;
        this.rotate=rotate;
        this.moveDown=moveDown;
        this.moveRight=moveRight;
        this.moveLeft=moveLeft;


        // DOM
        this.canvas = root.querySelector("#myCanvas");
        this.ctx = this.canvas.getContext('2d');
        this.btn_start = root.querySelector("#btn_start");
        this.scoreEl = root.querySelector("#score");
        this.maxScoreEl = root.querySelector("#maxScore");
        this.nextPieceImg = root.querySelector("#nextPieceImg");
        this.btn_up = root.querySelector(".btn_up");
        this.btn_right = root.querySelector(".btn_right");
        this.btn_down = root.querySelector(".btn_down");
        this.btn_left = root.querySelector(".btn_left");
        this.gameover_message = root.querySelector(".gameover");


        // EVENT LISTENERS
        this.btn_start.addEventListener("click", () => this.start(this.btn_start.innerHTML));
        this.btn_up.addEventListener('click', () => this.rotate());
        this.btn_right.addEventListener('click', () => this.moveRight());
        this.btn_down.addEventListener('click', () => this.moveDown());
        this.btn_left.addEventListener('click', () => this.moveLeft());

        document.addEventListener("keydown", (event)=>{
            switch(event.code){
                case "ArrowUp":
                    this.rotate();
                    break;
                case "ArrowDown":
                    this.moveDown();
                    break;
                case "ArrowLeft":
                    this.moveLeft();
                    break;
                case "ArrowRight":
                    this.moveRight();
                    break;
            }
        })
    }


    drawGameboard(gameboard){
        for(let row=0;row<ROWS;row++){
            for(let col=0;col<COLUMNS;col++){
                let color = gameboard[row][col];
                this.drawSquare(col, row, color);
            }
        }
    }

    setNextPieceImg(imageSource){
        this.nextPieceImg.src = imageSource;
    }

    setButton(word, color){
        this.btn_start.innerHTML=word;
        this.btn_start.style.backgroundColor = color;
    }

    setScore(score){
        this.scoreEl.innerHTML = score;
    }

    setMaxScore(maxScore){
        this.maxScoreEl.innerHTML = maxScore;
    }

    showGameOverMessage(){
        this.gameover_message.classList.remove("hidden");
    }

    hideGameOverMessage(){
        this.gameover_message.classList.add("hidden");
    }

    drawSquare(x, y, color){
        // inner square
        this.ctx.fillStyle=color;
        this.ctx.fillRect(x*SQ+5, y*SQ+5, SQ-10, SQ-10);
    
        // border
        this.ctx.strokeStyle=color;
        this.ctx.strokeRect(x*SQ+2, y*SQ+2, SQ-4, SQ-4);
        this.ctx.stroke();
    
        // border
        this.ctx.strokeStyle=color;
        this.ctx.strokeRect(x*SQ+2, y*SQ+2, SQ-4, SQ-4);
        this.ctx.stroke();
    
        // border
        this.ctx.strokeStyle=color;
        this.ctx.strokeRect(x*SQ+2, y*SQ+2, SQ-4, SQ-4);
        this.ctx.stroke();
    
        // border
        this.ctx.strokeStyle=color;
        this.ctx.strokeRect(x*SQ+2, y*SQ+2, SQ-4, SQ-4);
        this.ctx.stroke();
    }

    
    fillTetromino(tetromino, x, y, color){
        for(let r=0;r<tetromino.length;r++){
            for(let c=0;c<tetromino.length;c++){
                if(tetromino[r][c]){
                    this.drawSquare(x+c, y+r, color);
                }
            }
        }
    }
}
