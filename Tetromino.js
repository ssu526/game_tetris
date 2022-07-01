export default class Tetromino{
    constructor(piece){
        this.tetromino = piece;
        this.n = 0;
        this.activeTetromino = this.tetromino[this.n];
        this.x=COLUMNS/2-1;
        this.y=0;
    }


    moveDown(gameboard, view){
        //keep moving down if there's no collision. Lock the piece if there's a collision.
        if(!this._collision(1, 0, this.activeTetromino, gameboard)){
            view.fillTetromino(this.activeTetromino, this.x, this.y, VACANT_COLOR);
            this.y = this.y+1;
            view.fillTetromino(this.activeTetromino, this.x, this.y, OCCUPIED_COLOR);
        }else{
            return this._lockPiece(gameboard, view);
        }
    }
    
    moveLeft(gameboard, view){
        if(!this._collision(0,-1, this.activeTetromino, gameboard)){
            view.fillTetromino(this.activeTetromino, this.x, this.y, VACANT_COLOR);
            this.x = this.x-1;
            view.fillTetromino(this.activeTetromino, this.x, this.y, OCCUPIED_COLOR);
        }
    }
    
    moveRight(gameboard, view){
        if(!this._collision(0,1, this.activeTetromino, gameboard)){
            view.fillTetromino(this.activeTetromino, this.x, this.y, VACANT_COLOR);
            this.x = this.x+1;
            view.fillTetromino(this.activeTetromino, this.x, this.y, OCCUPIED_COLOR);
        }
    }
    

    rotate(gameboard, view){
        let nextN =  (this.n+1)%this.tetromino.length;
        let nextPattern =this.tetromino[nextN];
    
        let deltaX = 0;
        if(this._collision(0, 0, nextPattern, gameboard)) deltaX = this.x>COLUMNS/2 ? -1:1;
        
        //This is for the pattern 'I's rotation when it's kicking the right wall. It needs extra space to rotate.
        if(this._collision(0, deltaX, nextPattern, gameboard)) deltaX = this.x>COLUMNS/2 ? deltaX-1:deltaX+1; 
    
        if(!this._collision(0, deltaX, nextPattern, gameboard)){
            view.fillTetromino(this.activeTetromino, this.x, this.y, VACANT_COLOR);
            this.activeTetromino = nextPattern;
            this.n=nextN;
            this.x=this.x+deltaX;
            view.fillTetromino(this.activeTetromino, this.x, this.y, OCCUPIED_COLOR);
        }
    }
    
    _collision(deltaY, deltaX, piece, gameboard){
        for(let r=0;r<piece.length;r++){
            for(let c=0;c<piece.length;c++){
                if(piece[r][c]==0) continue;
    
                let newX = this.x+c+deltaX;
                let newY = this.y+r+deltaY;
    
                if(newX<0 || newX>=COLUMNS || newY>=ROWS) return true;
                if(gameboard[newY][newX]==OCCUPIED_COLOR) return true;
            }
        }
    
        return false;
    }
    
    _lockPiece(gameboard, view){
        let gameover = false;
        let additionalScore = 0;

        // Lock the piece if the piece cannot go down anymore (The tetromino is drew on the canvas permanently)
        for(let r=0;r<this.activeTetromino.length;r++){
            for(let c=0;c<this.activeTetromino.length;c++){
                if(this.activeTetromino[r][c]){
                    view.fillTetromino(this.activeTetromino, this.x, this.y, OCCUPIED_COLOR);
                    gameboard[this.y+r][this.x+c]=OCCUPIED_COLOR;
    
                    if(this.y+r<=0){
                        gameover=true;
                        return {gameboard, gameover, additionalScore};
                    }
                }
            }
        }

    
        // Check and remove full row after a piece is locked
        for(let r=0;r<ROWS;r++){

            let fullRow = true;

            for(let c=0;c<COLUMNS;c++){
                if(gameboard[r][c]==VACANT_COLOR){
                    fullRow=false;
                    break;
                }
            }
    
            if(fullRow){
                additionalScore = additionalScore + FULL_ROW_SCORE;
    
                // Starting from the bottom of the gameboard, replace a row with the row above it
                for(let m=r;m>0;m--){
                    for(let n=0;n<COLUMNS;n++){
                        gameboard[m][n]=gameboard[m-1][n];
                    }
                }
    
                // Set the first row of the gameboard to vancant
                for(let col=0;col<COLUMNS;col++){
                    gameboard[0][col]=VACANT_COLOR;
                }

                // Draw the updatd gameboard
                view.drawGameboard(gameboard);
            }
        }

        // Return the status of the game to controller
        return {gameboard, gameover, additionalScore}
    }    
}



