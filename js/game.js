"use strict"
var GAME_CONTROL = {
    KEY_W: 37,
    KEY_S: 39,
    KEY_D: 38,
    KEY_A: 40,
    SPACE: 32,
};

var GAME_CONFIG = {
    WIDTH: 1200,
    HEIGHT: 700,
};

var PLAYER_CONFIG = {
    WIDTH: 20,
    HEIGHT: 20,
    MAX_SPEED: 400,
    POSITION_X: 0,
    POSITION_Y: 0,
};



var GAME_STATE = {
    lastTime: Date.now(),
    wPressed: false,
    sPressed: false,
    dPressed: false,
    aPressed: false,
    spacePressed: false,

};

function setPosition(targ, x, y) {
    targ.style.transform = "translate(" + x + "px, " + y + "px)";
};

function borderCollision(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else return value;
}

function init() {
    var container = document.querySelector(".game");
    createPlayer(container);
};
init();

// PLAYER

function createPlayer(container) {
    PLAYER_CONFIG.POSITION_X = GAME_CONFIG.WIDTH / 2;
    PLAYER_CONFIG.POSITION_Y = GAME_CONFIG.HEIGHT - 50;

    var player = document.createElement("img");
    player.src = "../img/marioTank.png";
    player.className = "player";

    container.appendChild(player);

    setPosition(player, PLAYER_CONFIG.POSITION_X, PLAYER_CONFIG.POSITION_Y);
};

function KEY_DdatePlayer(dataTime) {
    if (GAME_STATE.wPressed) {
        PLAYER_CONFIG.POSITION_X -= dataTime * PLAYER_CONFIG.MAX_SPEED;
    }
    if (GAME_STATE.sPressed) {
        PLAYER_CONFIG.POSITION_X += dataTime * PLAYER_CONFIG.MAX_SPEED;
    }
    if (GAME_STATE.dPressed) {
        PLAYER_CONFIG.POSITION_Y -= dataTime * PLAYER_CONFIG.MAX_SPEED;
    }
    if (GAME_STATE.aPressed) {
        PLAYER_CONFIG.POSITION_Y += dataTime * PLAYER_CONFIG.MAX_SPEED;
    }
  
    var player = document.querySelector('.player');
    setPosition(player, PLAYER_CONFIG.POSITION_X, PLAYER_CONFIG.POSITION_Y);
}
// RENDER GAME

function renderGame() {
    var currentTime = Date.now();
    var dataTime = (currentTime - GAME_STATE.lastTime) / 1000;

    var container = document.querySelector('.game');
    KEY_DdatePlayer(dataTime);


    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(renderGame);
}
// KEY HANDLER

function keyDown(e) {
    if (e.keyCode === GAME_CONTROL.KEY_W) {
        GAME_STATE.wPressed = true;
    } else if (e.keyCode === GAME_CONTROL.KEY_S) {
        GAME_STATE.sPressed = true;
    } else if (e.keyCode === GAME_CONTROL.KEY_D) {
        GAME_STATE.dPressed = true;
    } else if (e.keyCode === GAME_CONTROL.KEY_A) {
        GAME_STATE.aPressed = true;
    } else if (e.keyCode === GAME_CONTROL.SPACE) {
        GAME_STATE.spacePressed = true;
    }
};

function keyUp(e) {
    if (e.keyCode === GAME_CONTROL.KEY_W) {
        GAME_STATE.wPressed = false;
    } else if (e.keyCode === GAME_CONTROL.KEY_S) {
        GAME_STATE.sPressed = false;
    } else if (e.keyCode === GAME_CONTROL.KEY_D) {
        GAME_STATE.dPressed = false;
    } else if (e.keyCode === GAME_CONTROL.KEY_A) {
        GAME_STATE.aPressed = false;
    } else if (e.keyCode === GAME_CONTROL.SPACE) {
        GAME_STATE.spacePressed = false;
    }
};

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.requestAnimationFrame(renderGame);