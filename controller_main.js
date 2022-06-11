import View from '/view.js'
import Tetromino from './controller_tetromino.js';

export default class Control{
    constructor(root){
        this.gameboard=[];
        this.score=0;
        this.currentPiece = this._getRandomPiece();
        this.nextPiece = this._getRandomPiece();
        this.nextPieceIndex=Math.floor(Math.random()*TETROMINOES.length);
        this.dropStartTime = Date.now();
        this.gameover=false;
        this.maxScore=0;
        this.animationReq = null
        this.view = new View(root, this._handlers());
    }

    start(){
        this._reset();
        this._initGameboard();
        this.view.drawGameboard(this.gameboard);
    }


    _reset(){
        this.gameboard = [];

        this.score=0;
        this.view.setScore(this.score);

        this.currentPiece = this._getRandomPiece();
        this.nextPiece = this._getRandomPiece();
        this.dropStartTime = Date.now();
        this.gameover=false;
    }


    _initGameboard(){
        for(let row=0;row<ROWS;row++){
            this.gameboard[row]=[];
            for(let col=0;col<COLUMNS;col++){
                this.gameboard[row][col] = VACANT_COLOR;
            }
        }
    }

    _handleGameOver(){
        this.view.setButton("START", "rgb(88, 143, 88)"); //green
        this.view.showGameOverMessage();
    }

    _getRandomPiece(){
        this.nextPieceIndex = Math.floor(Math.random()*TETROMINOES.length);
        return new Tetromino(TETROMINOES[this.nextPieceIndex]);
    }

    _showNextPiece(){
        this.currentPiece=this.nextPiece;
        this.nextPiece=this._getRandomPiece();
        this.view.setNextPieceImg(IMAGES_SOURCE[this.nextPieceIndex]);
    }

    _handleLockedPiece(result){
        this.gameboard = result.gameboard;
        this.gameover = result.gameover
        this.score = this.score + result.additionalScore;
        this.view.setScore(this.score);

        if(this.score>this.maxScore){
            this.maxScore=this.score;
            this.view.setMaxScore(this.maxScore);
        }

        this._showNextPiece();
    }


    _drop(){
        let now = Date.now();
        let timePassed = now - this.dropStartTime;
    
        if(timePassed>SPEED){
            this.dropStartTime=now;

            if(!this.gameover){
                //If result is undefined, it means there's no collision and the current piece will keep moving down.
                //If result is not undefined, it means there's a collision and the currenct piece is locked.
                let result = this.currentPiece.moveDown(this.gameboard, this.view);
                if(result!==undefined) this._handleLockedPiece(result);
            }

            if(this.gameover) this._handleGameOver();
        }
    
        if(this.gameover==false){
            this.animationReq = requestAnimationFrame(this._drop.bind(this));
        }
    } 


    _handlers(){
        return{
            start: (buttonText) =>{
                if(buttonText==="START"){
                    this._reset();
                    this._initGameboard();

                    this.view.setButton("STOP", "rgb(163, 91, 91)"); //red
                    this.view.hideGameOverMessage();
                    this.view.setNextPieceImg(IMAGES_SOURCE[this.nextPieceIndex]);
                    this.view.drawGameboard(this.gameboard);
                    
                    this._drop();

                }else{
                    this.view.setButton("START", "rgb(88, 143, 88)"); //green
                    this.view.showGameOverMessage();
                    cancelAnimationFrame(this.animationReq);
                    this.gameover=true;
                }
            },

            moveRight: () => {
                if(!this.gameover) this.currentPiece.moveRight(this.gameboard, this.view);
            },

            moveLeft: () => {
                if(!this.gameover) this.currentPiece.moveLeft(this.gameboard, this.view);
            },

            rotate: () => {
                if(!this.gameover) this.currentPiece.rotate(this.gameboard, this.view);
            },

            moveDown: () => {
                if(!this.gameover){
                    //If result is undefined, it means there's no collision and the current piece will keep moving down.
                    //If result is not undefined, it means there's a collision and the currenct piece is locked.
                    let result = this.currentPiece.moveDown(this.gameboard, this.view);
                    if(result!==undefined) this._handleLockedPiece(result);
                }

                if(this.gameover) this._handleGameOver();
            }
        }
    }
}


