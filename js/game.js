"use strict"

// #region config

var GAME_CONTROL = {
    KEY_W: 87,
    KEY_S: 83,
    KEY_D: 68,
    KEY_A: 65,
    KEY_R: 82,
    KEY_Q: 81,
    KEY_E: 69,
    SPACE: 32,
};

var GAME_CONFIG = {
    WIDTH: 1200,
    HEIGHT: 700,
    MOUSE_X: 0,
    MOUSE_Y: 0,
};

var TURRET_CONFIG = {
    ANGLE: 0,
    POSITION_X: 0,
    POSITION_Y: 0,
    BASE_X: 0,
    BASE_Y: 0,
}

var MOUSE_CONFIG ={
    POSITION_X: 0,
    POSITION_Y: 0,
}

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
    r_key: false,
    q_key: false,
    e_key: false,
    spacePressed: false,

};

// #endregion

// #region some Function

function setPosition(targ, x, y, deg) {
    targ.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + deg + "deg)";
};

function setRotation(container, deg) {
    container.style.transform = "rotate(" + deg + "deg)";
}

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

// #endregion

// #region player 

// PLAYER

function createPlayer(container) {
    PLAYER_CONFIG.POSITION_X = (GAME_CONFIG.WIDTH / 2) - (PLAYER_CONFIG.WIDTH / 2);
    PLAYER_CONFIG.POSITION_Y = (GAME_CONFIG.HEIGHT / 2) - (PLAYER_CONFIG.HEIGHT / 2);
    PLAYER_CONFIG.DEGREE = (Math.PI * 2) / 360;

    var player = document.createElement("div");
    var turret = document.createElement('div');
    var cannon = document.createElement('div');
    player.className = "player";
    turret.className = 'turret'
    cannon.className = "cannon";

    turret.appendChild(cannon);
    player.appendChild(turret);
    container.appendChild(player);

    setPosition(player, PLAYER_CONFIG.POSITION_X, PLAYER_CONFIG.POSITION_Y, PLAYER_CONFIG.DEGREE);
    setPosition(turret, 0, 0, TURRET_CONFIG.ANGLE)
};
//END
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
        PLAYER_CONFIG.HEIGHT - (PLAYER_CONFIG.HEIGHT * 2),
        GAME_CONFIG.HEIGHT);

    setPosition(player, PLAYER_CONFIG.POSITION_X, PLAYER_CONFIG.POSITION_Y, PLAYER_CONFIG.ANGLE);
}
// #endregion
// RENDER GAME

function renderGame() {
    var cannon = document.querySelector(".game");

    updatePlayer();
    cannon.addEventListener("mousemove", getMouseDirection);

    // GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(renderGame);
}

// #region key handler

function getMouseDirection(e) {
    var turret = document.querySelector('.turret');
    MOUSE_CONFIG.POSITION_X = e.clientX + 20 ;
    MOUSE_CONFIG.POSITION_Y = e.clientY + 50;
    TURRET_CONFIG.BASE_X = GAME_CONFIG.WIDTH / 1.5;
    TURRET_CONFIG.BASE_Y = GAME_CONFIG.HEIGHT / 1.5;

    TURRET_CONFIG.ANGLE = Math.atan2(MOUSE_CONFIG.POSITION_X - TURRET_CONFIG.BASE_X, -(MOUSE_CONFIG.POSITION_Y - TURRET_CONFIG.BASE_Y)) *  (180 / Math.PI );
    TURRET_CONFIG.ANGLE -= PLAYER_CONFIG.ANGLE;
    TURRET_CONFIG.ANGLE = turret.style.transform = 'rotate(' + TURRET_CONFIG.ANGLE + 'deg)';

    //update turret pos
    turretPositionUpdater(turret);
}

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

function keyPress(e) {
    if (GAME_STATE.KEY_R === true) {
        if (e.keyCode === GAME_CONTROL.KEY_Q) {
            GAME_STATE.KEY_Q = true;

        }
    }
}

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
window.addEventListener('.keypress', keyPress)
window.requestAnimationFrame(renderGame);

// #endregion