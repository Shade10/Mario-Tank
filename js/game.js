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
    COUNTDOWN: 3,
    START_COUNT_DOWN: 3,
}

var BULLET_CONFIG = {
    BULLETS_LIST: [],
    POSITION_X: 0,
    POSITION_Y: 0,
    MAX_SPEED: 100,
    ANGLE: 0,
}

var MOUSE_CONFIG = {
    POSITION_X: 0,
    POSITION_Y: 0,
}

var PLAYER_CONFIG = {
    WIDTH: 40,
    HEIGHT: 60,
    MAX_SPEED: 2,     // 0.4 best setting
    MAX_SPEED_ROTATE: 1.5,  // 0.3 best setting
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
    turret_reloaded: false,
    bullet_ready: false,
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
    setRotation(turret, TURRET_CONFIG.ANGLE)
};

function updatePlayer(container) {
    var player = document.querySelector('.player');
    var turret = document.querySelector('.turret');
    var sideRight = document.querySelector('.sideRight');
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

    if (GAME_STATE.r_key === false && GAME_STATE.q_key) {
        TURRET_CONFIG.ANGLE--;
    }
    if (GAME_STATE.r_key === false && GAME_STATE.e_key) {
        TURRET_CONFIG.ANGLE++;
    }
    if (GAME_STATE.spacePressed) {

        if (!GAME_STATE.turret_reloaded & !GAME_STATE.bullet_ready) {
            GAME_STATE.turret_reloaded = true;
            TURRET_CONFIG.START_COUNT_DOWN = TURRET_CONFIG.COUNTDOWN;
            sideRight.innerHTML = 'Bullet ready in ' + TURRET_CONFIG.START_COUNT_DOWN + 's';

            var interval = setInterval(() => {
                TURRET_CONFIG.START_COUNT_DOWN--;
                sideRight.innerHTML = 'Bullet ready in ' + TURRET_CONFIG.START_COUNT_DOWN + 's';
            }, 1000);

            setTimeout(() => {
                GAME_STATE.bullet_ready = true;
                GAME_STATE.turret_reloaded = false;
                GAME_STATE.spacePressed = false;
                sideRight.innerHTML = 'Bullet ready ........';
                clearInterval(interval);
            }, 3000);
            return;
        }
        if (GAME_STATE.bullet_ready && !GAME_STATE.turret_reloaded) {
            createBullet(container, PLAYER_CONFIG.POSITION_X - 9, PLAYER_CONFIG.POSITION_Y - 80, TURRET_CONFIG.ANGLE)
            console.log('before: ' + GAME_STATE.bullet_ready);
            console.log('before: ' + GAME_STATE.turret_reloaded);
            GAME_STATE.bullet_ready = false;
            GAME_STATE.spacePressed = false;
            console.log('after: ' + GAME_STATE.bullet_ready);
            console.log('after: ' + GAME_STATE.turret_reloaded);
            sideRight.innerHTML = 'Reload is needed';
            return;
        }
    }
    PLAYER_CONFIG.POSITION_X = borderCollision(PLAYER_CONFIG.POSITION_X,
        0 - PLAYER_CONFIG.WIDTH,
        GAME_CONFIG.WIDTH + PLAYER_CONFIG.WIDTH);

    PLAYER_CONFIG.POSITION_Y = borderCollision(PLAYER_CONFIG.POSITION_Y,
        PLAYER_CONFIG.HEIGHT - (PLAYER_CONFIG.HEIGHT * 2),
        GAME_CONFIG.HEIGHT);

    setPosition(player, PLAYER_CONFIG.POSITION_X, PLAYER_CONFIG.POSITION_Y, PLAYER_CONFIG.ANGLE);
    setRotation(turret, TURRET_CONFIG.ANGLE);
}

// PLAYER BULLET

function setBulletPosition(targ, x, y) {
    targ.style.transform = "translate(" + x + "px, " + y + "px)";
};

function createBullet(container, x, y, angle) {
    var element = document.createElement("div");
    element.className = "bullet";

    container.appendChild(element);

    var bullet = {
        element,
        x,
        y,
        angle
    };
    BULLET_CONFIG.BULLETS_LIST.push(bullet);

    setPosition(element, x, y, angle);
}

function updateBullet(dateTime, container) {
    var bullets = BULLET_CONFIG.BULLETS_LIST;

    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.y -= dateTime * BULLET_CONFIG.MAX_SPEED;
        if (bullet.y < 0) {
            destroyBullet(container, bullet);
        }
        BULLET_CONFIG.ANGLE = Math.atan2(-TURRET_CONFIG.BASE_X, -(TURRET_CONFIG.BASE_Y)) * (180 / Math.PI);
        // bullet.angle = Math.atan2(-TURRET_CONFIG.BASE_X, -(TURRET_CONFIG.BASE_Y)) * (180 / Math.PI);

        setPosition(bullet.element, bullet.x, bullet.y, bullet.angle);
    }
    BULLET_CONFIG.BULLETS_LIST = BULLET_CONFIG.BULLETS_LIST.filter(e => !e.isDead);
}

function destroyBullet(container, bullet) {
    container.removeChild(bullet.element);
    bullet.isDead = true;
}

// turret


// #endregion
// RENDER GAME

function renderGame() {
    var container = document.querySelector(".game");
    var currentTime = Date.now();
    var dataTime = (currentTime - GAME_STATE.lastTime) / 1000;
    updatePlayer(container);
    updateBullet(dataTime, container);
    for (var i = 0; i < BULLET_CONFIG.BULLETS_LIST.length; i++) {
        const bullet = BULLET_CONFIG.BULLETS_LIST[i];
        setTimeout(() => {
            destroyBullet(container, bullet );
        }, 3000);
        
    }
    // cannon.addEventListener("mousemove", getMouseDirection);

    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(renderGame);
}

// #region key handler

function getMouseDirection(e) {
    // e.preventDefault();
    MOUSE_CONFIG.POSITION_X = e.clientX + 20;  // e.clientX + 20
    MOUSE_CONFIG.POSITION_Y = e.clientY + 50;   // e.clientY + 50
    TURRET_CONFIG.BASE_X = GAME_CONFIG.WIDTH / 1.5;     // GAME_CONFIG.WIDTH / 1.5
    TURRET_CONFIG.BASE_Y = GAME_CONFIG.HEIGHT / 1.5;    // GAME_CONFIG.HEIGHT / 1.5 

    TURRET_CONFIG.ANGLE = Math.atan2(MOUSE_CONFIG.POSITION_X - TURRET_CONFIG.BASE_X, -(MOUSE_CONFIG.POSITION_Y - TURRET_CONFIG.BASE_Y)) * (180 / Math.PI);
    TURRET_CONFIG.ANGLE -= PLAYER_CONFIG.ANGLE;
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
    } else if (e.keyCode === GAME_CONTROL.KEY_Q) {
        GAME_STATE.q_key = true;
    } else if (e.keyCode === GAME_CONTROL.KEY_E) {
        GAME_STATE.e_key = true;
    } else if (event.keyCode === GAME_CONTROL.KEY_R) {
        if (!GAME_STATE.r_key) {
            GAME_STATE.r_key = true;
            window.addEventListener('mousemove', getMouseDirection)
            return;
        }
        if (GAME_STATE.r_key) {
            GAME_STATE.r_key = false;
            window.removeEventListener('mousemove', getMouseDirection);
            return;
        }
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
    } else if (e.keyCode === GAME_CONTROL.KEY_Q) {
        GAME_STATE.q_key = false;
    } else if (e.keyCode === GAME_CONTROL.KEY_E) {
        GAME_STATE.e_key = false;
    }
    //  else if (e.keyCode === GAME_CONTROL.SPACE) {
    //     GAME_STATE.spacePressed = false;
    // }
};

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.requestAnimationFrame(renderGame);

// #endregion