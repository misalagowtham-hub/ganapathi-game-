/* =====================================================
   GANESH FESTIVAL RUN
   FINAL FIXED GAME JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const scene = document.getElementById("scene");

const world = document.getElementById("world");

const player = document.getElementById("player");

const objectsContainer =
    document.getElementById("objects");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");

const jumpButton =
    document.getElementById("jumpButton");

const pauseButton =
    document.getElementById("pauseButton");

const restartButton =
    document.getElementById("restartButton");

const mapButton =
    document.getElementById("mapButton");

const continueButton =
    document.getElementById("continueButton");


/* HUD */

const distanceValue =
    document.getElementById("distanceValue");

const scoreValue =
    document.getElementById("scoreValue");

const comboValue =
    document.getElementById("comboValue");

const livesValue =
    document.getElementById("livesValue");

const speedValue =
    document.getElementById("speedValue");

const missionValue =
    document.getElementById("missionValue");


/* OFFERINGS */

const modakValue =
    document.getElementById("modakValue");

const durvaValue =
    document.getElementById("durvaValue");

const flowerValue =
    document.getElementById("flowerValue");

const diyaValue =
    document.getElementById("diyaValue");


/* OTHER */

const message =
    document.getElementById("message");

const gameOver =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");

const gameOverRestart =
    document.getElementById("gameOverRestart");

const soundButton =
    document.getElementById("soundButton");


/* =====================================================
   GAME STATE
===================================================== */

let gameRunning = false;

let paused = false;

let gameOverState = false;

let lastTime = 0;


/* =====================================================
   SCORE / DISTANCE
===================================================== */

let distance = 0;

let score = 0;

let combo = 1;


/* =====================================================
   LIVES
===================================================== */

let lives = 3;


/* =====================================================
   SPEED
===================================================== */

let gameSpeed = 1;


/* =====================================================
   PLAYER JUMP
===================================================== */

let playerY = 0;

let playerVelocity = 0;

let isJumping = false;


/*
   Smooth normal jump.

   The values are intentionally moderate so
   Mushak clears the obstacle without flying
   across the screen.
*/

const JUMP_POWER = 1.20;

const GRAVITY = 0.060;


/* =====================================================
   SPAWN TIMERS
===================================================== */

let spawnTimer = 0;

let obstacleTimer = 0;


/* =====================================================
   MESSAGE
===================================================== */

let messageTimer = null;


/* =====================================================
   HIT COLOUR
===================================================== */

let hitIndex = 0;


/* =====================================================
   COLLECTIBLE COUNTERS
===================================================== */

let modakCount = 0;

let durvaCount = 0;

let flowerCount = 0;

let diyaCount = 0;

let missionCount = 0;


/* =====================================================
   OBJECT LIST
===================================================== */

const objects = [];


/* =====================================================
   COLLECTIBLES
===================================================== */

const collectibleTypes = [

    {
        type: "flower",
        emoji: "🌸"
    },

    {
        type: "durva",
        emoji: "🍃"
    },

    {
        type: "diya",
        emoji: "🪔"
    },

    {
        type: "modak",
        emoji: "🥟"
    }

];


/* =====================================================
   OBSTACLES
===================================================== */

const obstacleTypes = [

    "🪨",

    "🪵",

    "🪨"

];


/* =====================================================
   START GAME
===================================================== */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    if (gameRunning) {
        return;
    }

    resetGame();

    gameRunning = true;

    paused = false;

    gameOverState = false;

    startScreen.style.display = "none";

    continueButton.style.display = "none";

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);

    showMessage(
        "🪔 Ganesh Festival Run"
    );
}


/* =====================================================
   RESET GAME
===================================================== */

function resetGame() {

    distance = 0;

    score = 0;

    combo = 1;

    lives = 3;

    gameSpeed = 1;

    playerY = 0;

    playerVelocity = 0;

    isJumping = false;

    spawnTimer = 0;

    obstacleTimer = 0;

    hitIndex = 0;


    modakCount = 0;

    durvaCount = 0;

    flowerCount = 0;

    diyaCount = 0;

    missionCount = 0;


    objects.length = 0;

    objectsContainer.innerHTML = "";


    player.style.transform =
        "translateY(0px)";


    scene.classList.remove(
        "hitFlash"
    );

    scene.style.setProperty(
        "--hit-color",
        "rgba(255,70,50,0.18)"
    );


    gameOver.style.display = "none";


    updateHUD();
}


/* =====================================================
   JUMP
===================================================== */

function jump() {

    if (
        !gameRunning ||
        paused ||
        gameOverState
    ) {
        return;
    }


    /*
       Do not allow double jumping.
    */

    if (isJumping) {
        return;
    }


    isJumping = true;


    /*
       Smooth normal jump.
    */

    playerVelocity = JUMP_POWER;
}


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();


            if (!gameRunning) {

                startGame();

                return;
            }


            jump();
        }


        if (
            event.code === "KeyP"
        ) {

            togglePause();
        }

    }
);


/* =====================================================
   BUTTON EVENTS
===================================================== */

jumpButton.addEventListener(
    "click",
    jump
);


pauseButton.addEventListener(
    "click",
    togglePause
);


restartButton.addEventListener(
    "click",
    restartGame
);


gameOverRestart.addEventListener(
    "click",
    restartGame
);


continueButton.addEventListener(
    "click",
    togglePause
);


mapButton.addEventListener(
    "click",
    showMap
);


/* =====================================================
   PAUSE
===================================================== */

function togglePause() {

    if (
        !gameRunning ||
        gameOverState
    ) {
        return;
    }


    paused = !paused;


    if (paused) {

        continueButton.style.display =
            "block";

        showMessage(
            "⏸ Game Paused"
        );

    } else {

        continueButton.style.display =
            "none";

        lastTime = performance.now();

        showMessage(
            "▶ Continue!"
        );
    }
}


/* =====================================================
   RESTART
===================================================== */

function restartGame() {

    gameRunning = false;

    paused = false;

    gameOverState = false;

    continueButton.style.display =
        "none";


    resetGame();


    startScreen.style.display =
        "none";


    gameRunning = true;

    lastTime = performance.now();


    requestAnimationFrame(
        gameLoop
    );


    showMessage(
        "🔄 Restarted!"
    );
}


/* =====================================================
   MAP
===================================================== */

function showMap() {

    if (
        !gameRunning ||
        paused
    ) {
        return;
    }


    showMessage(
        "🗺 Festival Street → Ganesh Darshan"
    );
}


/* =====================================================
   MAIN GAME LOOP
===================================================== */

function gameLoop(time) {

    if (!gameRunning) {
        return;
    }


    if (paused) {

        lastTime = time;

        requestAnimationFrame(
            gameLoop
        );

        return;
    }


    if (gameOverState) {
        return;
    }


    const delta =
        Math.min(
            (time - lastTime) / 16.67,
            2
        );


    lastTime = time;


    updatePlayer(delta);

    updateGame(delta);

    updateObjects(delta);

    spawnObjects(delta);

    checkCollisions();

    updateHUD();


    requestAnimationFrame(
        gameLoop
    );
}


/* =====================================================
   PLAYER JUMP PHYSICS
===================================================== */

function updatePlayer(delta) {

    if (isJumping) {

        /*
           Move upward.
        */

        playerY +=
            playerVelocity * delta;


        /*
           Gravity pulls Mushak back down.
        */

        playerVelocity -=
            GRAVITY * delta;


        /*
           Landing.
        */

        if (playerY <= 0) {

            playerY = 0;

            playerVelocity = 0;

            isJumping = false;
        }
    }


    /*
       Convert jump percentage into
       actual screen pixels.

       This keeps jump smooth even if
       the browser window changes size.
    */

    const jumpPixels =
        (playerY / 100) *
        scene.clientHeight;


    player.style.transform =
        `translateY(${-jumpPixels}px)`;
}


/* =====================================================
   GAME UPDATE
===================================================== */

function updateGame(delta) {

    /*
       Distance increases continuously.
    */

    distance +=
        0.45 *
        gameSpeed *
        delta;


    /*
       Score increases slowly with distance.
    */

    score +=
        0.7 *
        gameSpeed *
        delta;


    /*
       Gradually increase speed.

       Maximum = 2.4x
    */

    gameSpeed =
        Math.min(
            2.4,
            1 + distance / 1800
        );
}


/* =====================================================
   SPAWN SYSTEM
===================================================== */

/*
   BALANCE:

   About 5–6 collectibles
   for every obstacle.
*/

function spawnObjects(delta) {

    spawnTimer += delta;

    obstacleTimer += delta;


    /*
       Collectible approximately
       every 45 frames.
    */

    if (
        spawnTimer >= 45
    ) {

        spawnTimer = 0;

        createCollectible();
    }


    /*
       One obstacle approximately
       every 285 frames.

       This gives a lot more collectibles
       than obstacles.
    */

    if (
        obstacleTimer >= 285
    ) {

        obstacleTimer = 0;

        createObstacle();
    }
}


/* =====================================================
   CREATE COLLECTIBLE
===================================================== */

function createCollectible() {

    const item =
        collectibleTypes[
            Math.floor(
                Math.random() *
                collectibleTypes.length
            )
        ];


    const element =
        document.createElement("div");


    element.className =
        "gameObject collectible";


    element.dataset.type =
        item.type;


    element.textContent =
        item.emoji;


    /*
       Different natural heights.

       Still low enough to collect.
    */

    const heightChoices = [

        18,

        20,

        22,

        24

    ];


    const bottom =
        heightChoices[
            Math.floor(
                Math.random() *
                heightChoices.length
            )
        ];


    element.style.left =
        "101%";


    element.style.bottom =
        `${bottom}%`;


    objectsContainer.appendChild(
        element
    );


    objects.push({

        element: element,

        type: item.type,

        x: 101,

        bottom: bottom,

        isObstacle: false,

        collected: false

    });
}


/* =====================================================
   CREATE OBSTACLE
===================================================== */

function createObstacle() {

    const element =
        document.createElement("div");


    element.className =
        "gameObject obstacle";


    element.dataset.type =
        "obstacle";


    element.textContent =
        obstacleTypes[
            Math.floor(
                Math.random() *
                obstacleTypes.length
            )
        ];


    /*
       IMPORTANT:

       Obstacles are lower now.

       They sit on the road instead of
       appearing too high.
    */

    element.style.left =
        "101%";


    element.style.bottom =
        "11.5%";


    objectsContainer.appendChild(
        element
    );


    objects.push({

        element: element,

        type: "obstacle",

        x: 101,

        bottom: 11.5,

        isObstacle: true,

        hit: false

    });
}


/* =====================================================
   MOVE OBJECTS
===================================================== */

function updateObjects(delta) {

    /*
       Smooth movement.
    */

    const movement =
        0.42 *
        gameSpeed *
        delta;


    for (
        let i = objects.length - 1;
        i >= 0;
        i--
    ) {

        const object =
            objects[i];


        object.x -= movement;


        object.element.style.left =
            `${object.x}%`;


        /*
           Remove when completely
           outside the left side.
        */

        if (
            object.x < -8
        ) {

            object.element.remove();

            objects.splice(
                i,
                1
            );
        }
    }
}


/* =====================================================
   COLLISION CHECK
===================================================== */

function checkCollisions() {

    const playerRect =
        player.getBoundingClientRect();


    for (
        const object of objects
    ) {

        const rect =
            object.element
                .getBoundingClientRect();


        /*
           Only check when the object
           is close to Mushak.
        */

        if (
            object.x < 30 &&
            object.x > 8
        ) {

            if (
                rectanglesOverlap(
                    playerRect,
                    rect
                )
            ) {

                if (
                    object.isObstacle
                ) {

                    if (!object.hit) {

                        object.hit = true;

                        hitObstacle(
                            object
                        );
                    }

                } else {

                    if (
                        !object.collected
                    ) {

                        object.collected =
                            true;

                        collectItem(
                            object
                        );
                    }
                }
            }
        }
    }
}


/* =====================================================
   RECTANGLE COLLISION
===================================================== */

function rectanglesOverlap(
    a,
    b
) {

    return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
}


/* =====================================================
   COLLECT ITEM
===================================================== */

function collectItem(
    object
) {

    object.element.remove();


    const index =
        objects.indexOf(
            object
        );


    if (index !== -1) {

        objects.splice(
            index,
            1
        );
    }


    /*
       EVERY collectible counts
       toward the mission.
    */

    missionCount++;


    /*
       Combo increases.
    */

    combo =
        Math.min(
            10,
            combo + 1
        );


    /*
       More points for combos.
    */

    score +=
        100 * combo;


    /*
       Individual counters.
    */

    switch (
        object.type
    ) {

        case "modak":

            modakCount++;

            break;


        case "durva":

            durvaCount++;

            break;


        case "flower":

            flowerCount++;

            break;


        case "diya":

            diyaCount++;

            break;
    }


    showMessage(
        "✨ +100 Offering Collected!"
    );
}


/* =====================================================
   OBSTACLE HIT
===================================================== */

function hitObstacle(
    object
) {

    object.element.remove();


    const index =
        objects.indexOf(
            object
        );


    if (index !== -1) {

        objects.splice(
            index,
            1
        );
    }


    /*
       Lose exactly one heart.
    */

    lives--;


    /*
       Reset combo after a hit.
    */

    combo = 1;


    /* -----------------------------------------------
       SKY COLOUR ONLY
    ----------------------------------------------- */

    const hitColours = [

        "rgba(255,70,50,0.20)",

        "rgba(155,70,255,0.18)",

        "rgba(30,190,100,0.18)",

        "rgba(255,170,30,0.20)",

        "rgba(40,130,255,0.18)"

    ];


    scene.style.setProperty(

        "--hit-color",

        hitColours[
            hitIndex %
            hitColours.length
        ]

    );


    hitIndex++;


    /*
       Restart the flash animation.
    */

    scene.classList.remove(
        "hitFlash"
    );


    void scene.offsetWidth;


    scene.classList.add(
        "hitFlash"
    );


    /* -----------------------------------------------
       GAME OVER ONLY WHEN ALL 3 HEARTS ARE LOST
    ----------------------------------------------- */

    if (lives > 0) {

        showMessage(
            `💥 HIT! ${lives} ❤️ LEFT`
        );

    } else {

        endGame();
    }
}


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    gameRunning = false;

    gameOverState = true;

    paused = false;


    finalScore.textContent =
        Math.floor(score);


    gameOver.style.display =
        "flex";


    continueButton.style.display =
        "none";
}


/* =====================================================
   HUD UPDATE
===================================================== */

function updateHUD() {

    /*
       DISTANCE
    */

    distanceValue.textContent =
        `${Math.floor(distance)} m`;


    /*
       SCORE
    */

    scoreValue.textContent =
        Math.floor(score);


    /*
       COMBO
    */

    comboValue.textContent =
        `x${combo}`;


    /*
       LIVES
    */

    if (lives === 3) {

        livesValue.textContent =
            "❤️❤️❤️";

    } else if (lives === 2) {

        livesValue.textContent =
            "❤️❤️";

    } else if (lives === 1) {

        livesValue.textContent =
            "❤️";

    } else {

        livesValue.textContent =
            "💔";
    }


    /*
       SPEED
    */

    speedValue.textContent =
        `${gameSpeed.toFixed(1)}x`;


    /*
       MISSION
    */

    missionValue.textContent =
        `${missionCount} / 10`;


    /*
       OFFERINGS
    */

    modakValue.textContent =
        modakCount;


    durvaValue.textContent =
        durvaCount;


    flowerValue.textContent =
        flowerCount;


    diyaValue.textContent =
        diyaCount;
}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    text
) {

    message.textContent =
        text;


    message.classList.add(
        "show"
    );


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(
            function() {

                message.classList.remove(
                    "show"
                );

            },
            1400
        );
}


/* =====================================================
   SOUND BUTTON
===================================================== */

let soundOn = true;


soundButton.addEventListener(
    "click",
    function() {

        soundOn = !soundOn;


        soundButton.textContent =
            soundOn
                ? "🔊"
                : "🔇";
    }
);


/* =====================================================
   INITIAL HUD
===================================================== */

updateHUD();