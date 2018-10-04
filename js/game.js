"use strict"
var GAME_CONTROL = {
    KEY_W: 87,
    KEY_S: 83,
    KEY_D: 68,
    KEY_A: 65,
    SPACE: 32,
};

var GAME_CONFIG = {
    WIDTH: 1200,
    HEIGHT: 700,
};

var PLAYER_CONFIG = {
    WIDTH: 40,
    HEIGHT: 60,
    MAX_SPEED: 2,     // 0.4 best setting
    MAX_SPEED_ROTATE: 1.8,  // 0.3 best setting
    POSITION_X: 0,
    POSITION_Y: 0,
    DEGREE: 0,
    ANGLE: 0,
};



var GAME_STATE = {
    lastTime: Date.now(),
    up_Key: false,
    down_Key: false,
    rotate_Right: false,
    rotate_Left: false,
    spacePressed: false,

};

function setPosition(targ, x, y, deg) {
    targ.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + deg + "deg)";
};

function borderCollision(value, min, max) {
    if (value < min) {
        return max;
    } else if (value > max) {
        return min;
    } else return value;
}

function init() {
    var container = document.querySelector(".game");
    createPlayer(container);
};
init();

// PLAYER

function createPlayer(container) {
    PLAYER_CONFIG.POSITION_X = (GAME_CONFIG.WIDTH / 2) - (PLAYER_CONFIG.WIDTH / 2);
    PLAYER_CONFIG.POSITION_Y = (GAME_CONFIG.HEIGHT / 2) - (PLAYER_CONFIG.HEIGHT / 2);
    PLAYER_CONFIG.DEGREE = (Math.PI * 2) / 360;

    var player = document.createElement("div");
    player.className = "player";

    container.appendChild(player);


    setPosition(player, PLAYER_CONFIG.POSITION_X, PLAYER_CONFIG.POSITION_Y, PLAYER_CONFIG.DEGREE);
};

function updatePlayer() {
    var player = document.querySelector('.player');
    if (GAME_STATE.up_Key) {
        PLAYER_CONFIG.POSITION_X += PLAYER_CONFIG.MAX_SPEED * Math.sin(PLAYER_CONFIG.DEGREE * PLAYER_CONFIG.ANGLE);
        PLAYER_CONFIG.POSITION_Y -= PLAYER_CONFIG.MAX_SPEED * Math.cos(PLAYER_CONFIG.DEGREE * PLAYER_CONFIG.ANGLE);
    }
    if (GAME_STATE.down_Key) {
        PLAYER_CONFIG.POSITION_Y += PLAYER_CONFIG.MAX_SPEED * Math.cos(PLAYER_CONFIG.DEGREE * PLAYER_CONFIG.ANGLE);
        PLAYER_CONFIG.POSITION_X -= PLAYER_CONFIG.MAX_SPEED * Math.sin(PLAYER_CONFIG.DEGREE * PLAYER_CONFIG.ANGLE);
    }
    if (GAME_STATE.rotate_Right) {
        PLAYER_CONFIG.ANGLE += (PLAYER_CONFIG.MAX_SPEED_ROTATE);
    }
    if (GAME_STATE.rotate_Left) {
        PLAYER_CONFIG.ANGLE -= (PLAYER_CONFIG.MAX_SPEED_ROTATE);
    }

    PLAYER_CONFIG.POSITION_X = borderCollision(PLAYER_CONFIG.POSITION_X, 
        0 - PLAYER_CONFIG.WIDTH,
        GAME_CONFIG.WIDTH + PLAYER_CONFIG.WIDTH);

    PLAYER_CONFIG.POSITION_Y = borderCollision(PLAYER_CONFIG.POSITION_Y, 
        PLAYER_CONFIG.HEIGHT - (PLAYER_CONFIG.HEIGHT * 2 ),
        GAME_CONFIG.HEIGHT);


    setPosition(player, PLAYER_CONFIG.POSITION_X, PLAYER_CONFIG.POSITION_Y, PLAYER_CONFIG.ANGLE);
}
// RENDER GAME

function renderGame() {
    // var currentTime = Date.now();
    // var dataTime = (currentTime - GAME_STATE.lastTime) / 1000;
    // var container = document.querySelector('.game');
    updatePlayer();


    // GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(renderGame);
}
// KEY HANDLER

function keyDown(e) {
    if (e.keyCode === GAME_CONTROL.KEY_W) {
        GAME_STATE.up_Key = true;
    } else if (e.keyCode === GAME_CONTROL.KEY_S) {
        GAME_STATE.down_Key = true;
    } else if (e.keyCode === GAME_CONTROL.KEY_D) {
        GAME_STATE.rotate_Right = true;
    } else if (e.keyCode === GAME_CONTROL.KEY_A) {
        GAME_STATE.rotate_Left = true;
    } else if (e.keyCode === GAME_CONTROL.SPACE) {
        GAME_STATE.spacePressed = true;
    }
};

function keyUp(e) {
    if (e.keyCode === GAME_CONTROL.KEY_W) {
        GAME_STATE.up_Key = false;
    } else if (e.keyCode === GAME_CONTROL.KEY_S) {
        GAME_STATE.down_Key = false;
    } else if (e.keyCode === GAME_CONTROL.KEY_D) {
        GAME_STATE.rotate_Right = false;
    } else if (e.keyCode === GAME_CONTROL.KEY_A) {
        GAME_STATE.rotate_Left = false;
    } else if (e.keyCode === GAME_CONTROL.SPACE) {
        GAME_STATE.spacePressed = false;
    }
};

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.requestAnimationFrame(renderGame);