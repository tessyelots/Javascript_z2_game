// Marek Smutny
module.exports = class Game {
    constructor() {
        console.log("new Game instance");
        this.gameWidth = 160; //tiles
        this.gameHeight = 80; // tiles
        this.size = 10; //px
        this.roadSize = 6; //tiles
        
        this.line = [];
        this.generateLine();
        this.playerTx = 1;
        this.playerTy = this.gameHeight/2;
        this.iter = 0;
        this.speed = 75;
        this.score = 0;

        this.roadLines = [];
        this.redEdge = [];
        this.whiteEdge = [];
        this.car = [];
        this.colision = false;

    }

    drawWithStyle(points,style) {
        switch(style) {
            case 'road':
                this.roadLines = points;
            case 'red':
                this.redEdge = points;
            case 'white':
                this.whiteEdge = points;
            case 'car':
                this.car = points;
        }
    }

    drawPlayer(tx,ty) {
        var playerPoints = [
            [tx,ty],[tx+1,ty],[tx+2,ty],[tx+3,ty],[tx+4,ty],
            [tx,ty+1],[tx+1,ty+1],[tx+2,ty+1],[tx+3,ty+1],[tx+4,ty+1],
            [tx,ty+2],[tx+1,ty+2],[tx+2,ty+2],[tx+3,ty+2],[tx+4,ty+2]
        ];
    
        this.drawWithStyle(playerPoints,'car');
    }

    generateLine() {
        for(var i=0;i<this.gameWidth*2;i++) this.line.push(Math.floor(this.gameHeight/2));
    }

    fillRoadLine(line) {
        var roadLine = [];
        for(var i=0;i<line.length;i++) {
            for(var j=-this.roadSize+1;j<this.roadSize;j++) {
                roadLine.push([line[i][0],line[i][1]+j]);
            }
        }
        return roadLine;
    }

    fillEdgeLine(line) {
        var edgeLine = [];
        for(var i=0;i<line.length;i++) {
            edgeLine.push([line[i][0],line[i][1]-this.roadSize]);
            edgeLine.push([line[i][0],line[i][1]+this.roadSize]);
        }
        return edgeLine;
    }

    fillLinePoints(line) {
        return line.filter(function(point,index){
            return index < 160;
        }).map(function(point,index){
            return [index,point];
        });
    }

    drawEdgeLine(line, iter) {
        var red = [];
        var white = [];
        var div = 6;
        var th = 2;
        var iterd = iter % div;
        var redDivs = [];
        var whiteDivs = [];
        if(iterd === 0) {
            redDivs = [0,1,2];
            whiteDivs = [3,4,5];
        }
        else if (iterd === 1) {
            redDivs = [0,1,5];
            whiteDivs = [2,3,4];
        }
        else if (iterd === 2) {
            redDivs = [0,4,5];
            whiteDivs = [1,2,3];
        }
        else if (iterd === 3) {
            redDivs = [3,4,5];
            whiteDivs = [0,1,2];
        }
        else if (iterd === 4) {
            redDivs = [2,3,4];
            whiteDivs = [0,1,5];
        }
        else if (iterd === 5) {
            redDivs = [1,2,3];
            whiteDivs = [0,4,5];
        }
        red = line.filter(function(point,index){
            var point0d = point[0] % div;
            return redDivs.indexOf(point0d) > -1;
        });
        white = line.filter(function(point,index){
            var point0d = point[0] % div;
            return whiteDivs.indexOf(point0d) > -1;
        });
        this.drawWithStyle(red,'red');
        this.drawWithStyle(white,'white');
    }

    drawLine(line, iter) {
        var linePoints = this.fillLinePoints(line); 
        var road = this.fillRoadLine(linePoints);
        this.drawWithStyle(road,'road');
        var edge = this.fillEdgeLine(linePoints);
        this.drawEdgeLine(edge, iter);
    }

    moveLine(){
        this.line.shift();
        this.line.push(Math.floor(this.gameHeight/2));
    }

    random(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    bumpLine() {
        var gW = this.gameWidth;
        var gW2 = gW/2;
        var gW4 = gW/4;
        var gH = this.gameHeight;
        var gH2 = gH/2;
        var bump = this.random(0,gH-1);
    
        var bumpOffset = bump - gH2;
        if(bump < gH2) bumpOffset = gH2 - bump;
        if(bump !== Math.floor(gH2)) {
            var bx = gW+gW2;
            var by = bump;
            var sx = gW+1;
            var sy = gH2;
            var xx = gW+gW4;
            var xy = ((bump - gH2)/2)+gH2; 
            if(bump < gH2) xy = bump + (bumpOffset/2);
            var mx = gW+gW2;
            var my = gH2;
            var slope = gW2 / bumpOffset; //old Math.floor(gW/2) / (Math.floor(gH/2) - bump);
            var ox = gW+gW2;
            var oy = xy - (slope * (ox-xx));
            if(bump < gH2) oy = (slope * (ox-xx)) + xy;
            var r = by-oy;
            if(bump < gH2) r = oy-by;
            var ex = gW-2;
            var ey = Math.floor(gH/2);
            for(var i=gW+1;i<(gW*2)-1;i++) {
                var fx = i;
                this.line[i] = Math.floor(Math.sqrt((r*r)-((fx-ox)*(fx-ox)))+oy);
                if(bump < gH2) this.line[i] = -Math.floor(Math.sqrt((r*r)-((fx-ox)*(fx-ox)))-oy);
            }
        }
        else {
            for(var i=gW+1;i<(gW*2)-1;i++) {
                this.line[i] = Math.floor(gH2);
            }
        }
    }

    collision(playerTx, playerTy) {
        var tx = playerTx;
        var ty = playerTy;
        var playerPoints = [
            [tx,ty],[tx+1,ty],[tx+2,ty],[tx+3,ty],[tx+4,ty],
            [tx,ty+1],[tx+1,ty+1],[tx+2,ty+1],[tx+3,ty+1],[tx+4,ty+1],
            [tx,ty+2],[tx+1,ty+2],[tx+2,ty+2],[tx+3,ty+2],[tx+4,ty+2]
        ];
    
        var linePoints = this.fillLinePoints([this.line[0],this.line[1],this.line[2],this.line[3],this.line[4],this.line[5]]);
        var megaLinePoints = this.fillRoadLine(linePoints).concat(this.fillEdgeLine(linePoints));;
    
        var allIn = true;
        playerPoints.forEach(function(playerPoint){
            var isIn = false;
            megaLinePoints.forEach(function(linePoint){
                if(playerPoint[0] === linePoint[0] && playerPoint[1] === linePoint[1]) isIn = true;
            });
            if(!isIn) allIn = false;
        });
        return !allIn;
    }

    getGameLines(){
        return {
            type: 'update',
            road: this.roadLines,
            red: this.redEdge,
            white: this.whiteEdge,
            car: this.car,
            score: this.score,
            speed: this.speed,
        }
    }

    update(){
        this.iter++
        if((this.iter % 160) === 0 && this.iter !== 0) this.bumpLine();
        this.moveLine();
        this.drawLine(this.line, this.iter);
        this.drawPlayer(this.playerTx,this.playerTy);

        if(this.collision(this.playerTx, this.playerTy)) {
            console.log('collision');
            this.colision = true;
        }
        this.score += this.speed;
    }

    movePlayer(points) {
        this.playerTy = this.playerTy + points;
        if(this.playerTy<0) this.playerTy=0;
        if(this.playerTy > this.gameHeight-3) this.playerTy = this.gameHeight-3;
    }
}