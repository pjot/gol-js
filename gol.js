Config = {
    SIZE : 4,
    ALIVE : 'black',
    DEAD : 'white'
};

Game = function (element) {
    this.element = document.getElementById(element);
    this.canvas = this.element.getContext('2d');
    this.height = this.element.height / Config.SIZE;
    this.width = this.element.width / Config.SIZE;
    this.pixels = new Array(this.width);
    for (var y = 0; y < this.height; y++)
    {
        this.pixels[y] = new Array(this.width);
        for (var x = 0; x < this.width; x++)
        {
            this.pixels[y][x] = new Pixel(x, y, this.canvas);
        }
    }
};

Game.run = function (element) {
    game = new Game(element);
    game.start();
};

Game.prototype.start = function () {
    this.randomize();
    this.draw();
    this.tick();
};

Game.prototype.tick = function () {
    this.update();
    this.draw();
    window.requestAnimationFrame(function () { window.game.tick(); });
};

Game.prototype.draw = function () {
    this.pixelLoop(function (pixel) {
        pixel.draw();
    });
};

Game.prototype.pixelLoop = function (callback) {
    for (y in this.pixels)
    {
        for (x in this.pixels[y])
        {
            callback(this.pixels[y][x], this);
        }
    }
};

Game.prototype.update = function () {
    this.pixelLoop(function (pixel, game) {
        var alive_neighbours = game.getAliveNeighbours(pixel);
        if (pixel.isAlive() && (alive_neighbours < 2 || alive_neighbours > 3))
        {
            pixel.setValue(false);
        }
        if (pixel.isDead() && alive_neighbours == 3)
        {
            pixel.setValue(true);
        }
    });
};

Game.prototype.getAliveNeighbours = function (pixel) {
    var neighbours = [
        { x : -1, y : -1},
        { x : -1, y :  0},
        { x : -1, y :  1},
        { x :  0, y : -1},
        { x :  0, y :  1},
        { x :  1, y : -1},
        { x :  1, y :  0},
        { x :  1, y :  1}
    ],
        neighbour_count = 0,
        neighbour = null,
        n_x = null,
        n_y = null;

    for (n in neighbours)
    {
        neighbour = neighbours[n],
        n_x = pixel.x + neighbour.x,
        n_y = pixel.y + neighbour.y;
        if (this.pixels[n_y] && this.pixels[n_y][n_x])
        {
            if (this.pixels[n_y][n_x].wasAlive())
            {
                neighbour_count++;
            }
        }
    }
    return neighbour_count;
};

Game.prototype.go = function () {
    this.update();
    this.draw();
};

Game.prototype.randomize = function () {
    this.pixelLoop(function (pixel) {
        pixel.setValue(Math.random() < 0.2);
    });
};

Pixel = function (x, y, canvas) {
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.value = this.oldValue = false;
};

Pixel.prototype.draw = function () {
    this.canvas.fillStyle = this.isAlive() ? Config.ALIVE : Config.DEAD;
    this.canvas.fillRect(this.x * Config.SIZE, this.y * Config.SIZE, Config.SIZE, Config.SIZE);
    this.reset();
};

Pixel.prototype.isAlive = function () {
    return this.value;
}

Pixel.prototype.isDead = function () {
    return ! this.value;
};

Pixel.prototype.wasAlive = function () {
    return this.oldValue;
};

Pixel.prototype.reset = function () {
    this.oldValue = this.value;
};

Pixel.prototype.setValue = function (value)
{
    this.oldValue = this.value;
    this.value = value;
}

Game.run('game');
