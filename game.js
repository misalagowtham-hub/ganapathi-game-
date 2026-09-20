/* =========================================================
   MUSHAK: THE FESTIVAL RUN
   Ganesh Chaturthi Endless Runner
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const scene =
    document.getElementById("scene");

const player =
    document.getElementById("player");

const playerImage =
    player.querySelector("img");

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

const soundButton =
    document.getElementById("soundButton");

const message =
    document.getElementById("message");

const gameOver =
    document.getElementById("gameOver");

const gameOverRestart =
    document.getElementById("gameOverRestart");

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

const modakValue =
    document.getElementById("modakValue");

const durvaValue =
    document.getElementById("durvaValue");

const flowerValue =
    document.getElementById("flowerValue");

const diyaValue =
    document.getElementById("diyaValue");

const finalScore =
    document.getElementById("finalScore");

const heartsLost =
    document.getElementById("heartsLost");


/* =========================================================
   GAME STATE
========================================================= */

let gameRunning = false;

let paused = false;

let animationId = null;

let lastTime = 0;

let distance = 0;

let score = 0;

let combo = 1;

let lives = 3;

let speed = 0.52;

let playerY = 0;

let playerVelocity = 0;

let isJumping = false;

let objectId = 0;

let nextSpawnDistance = 180;

let obstacleCount = 0;

let missionProgress = 0;

const missionTarget = 10;

let modaks = 0;

let durvas = 0;

let flowers = 0;

let diyas = 0;

let soundOn = true;

let messageTimer = null;

let obstacleCooldown = 0;


/* =========================================================
   OBJECT DATA
========================================================= */

const objects = [];


/* =========================================================
   COLLECTIBLE TYPES
========================================================= */

const collectibleTypes = [

    {
        type: "modak",
        icon: "🍘",
        value: 10
    },

    {
        type: "durva",
        icon: "🍃",
        value: 8
    },

    {
        type: "flower",
        icon: "🌸",
        value: 8
    },

    {
        type: "diya",
        icon: "🪔",
        value: 12
    }

];


/* =========================================================
   BACKGROUND COLOUR SYSTEM
========================================================= */

/*
   IMPORTANT:

   There is NO overlay.
   There is NO extra canvas on the screen.

   The actual background image itself is processed
   and then placed back into #scene.

   Only blue sky pixels are changed.
*/

let backgroundImage =
    new Image();

let backgroundCanvas =
    document.createElement("canvas");

let backgroundContext =
    backgroundCanvas.getContext("2d");

let originalBackground =
    null;

let backgroundReady =
    false;

let currentBackgroundStage =
    0;


/*
   Colour for each 500 m.

   0 = original blue
   1 = pink
   2 = green
   3 = purple
   4 = orange
   5 = golden
   6 = rose
*/

const skyColours = [

    null,

    [245, 110, 175],

    [75, 185, 115],

    [155, 90, 220],

    [245, 155, 55],

    [225, 190, 65],

    [220, 90, 155]

];


/* =========================================================
   LOAD ORIGINAL BACKGROUND
========================================================= */

function loadBackground() {

    backgroundImage.onload =
        function () {

            backgroundCanvas.width =
                backgroundImage.naturalWidth;

            backgroundCanvas.height =
                backgroundImage.naturalHeight;


            /*
               Draw the ORIGINAL image.
            */

            backgroundContext.drawImage(
                backgroundImage,
                0,
                0,
                backgroundCanvas.width,
                backgroundCanvas.height
            );


            /*
               Save the original pixels.
            */

            originalBackground =
                backgroundContext.getImageData(
                    0,
                    0,
                    backgroundCanvas.width,
                    backgroundCanvas.height
                );


            backgroundReady = true;


            /*
               Keep the original image
               until 500 m.
            */

            scene.style.backgroundImage =
                'url("festival-game-bg.png")';


            currentBackgroundStage =
                0;
        };


    backgroundImage.onerror =
        function () {

            console.error(
                "festival-game-bg.png could not be loaded."
            );

        };


    backgroundImage.src =
        "festival-game-bg.png";
}


/* =========================================================
   CHECK IF PIXEL IS SKY
========================================================= */

function isSkyPixel(
    r,
    g,
    b
) {

    /*
       Only blue/cyan colours.

       This avoids recolouring
       brown wall and grey road.
    */

    return (
        b > 145 &&
        g > 125 &&
        b > r * 1.30 &&
        g > r * 1.18
    );
}


/* =========================================================
   CHECK HUD PROTECTION
========================================================= */

function isProtectedArea(
    x,
    y
) {

    const width =
        backgroundCanvas.width;

    const height =
        backgroundCanvas.height;


    const px =
        (x / width) * 100;

    const py =
        (y / height) * 100;


    /*
       Top-left festival title
    */

    if (
        px >= 2 &&
        px <= 23 &&
        py >= 6 &&
        py <= 17
    ) {

        return true;
    }


    /*
       Top-right Ganesh title
    */

    if (
        px >= 77 &&
        px <= 99 &&
        py >= 6 &&
        py <= 17
    ) {

        return true;
    }


    /*
       HUD row
    */

    if (
        py >= 20 &&
        py <= 32
    ) {

        return true;
    }


    /*
       Mission panel
    */

    if (
        px >= 0 &&
        px <= 31 &&
        py >= 31 &&
        py <= 47
    ) {

        return true;
    }


    /*
       Ganesh Darshan panel
    */

    if (
        px >= 55 &&
        px <= 76 &&
        py >= 32 &&
        py <= 48
    ) {

        return true;
    }


    /*
       Offerings panel
    */

    if (
        px >= 73 &&
        px <= 100 &&
        py >= 31 &&
        py <= 48
    ) {

        return true;
    }


    return false;
}


/* =========================================================
   CREATE COLOURED BACKGROUND
========================================================= */

function createColouredBackground(
    stage
) {

    if (
        !backgroundReady ||
        !originalBackground
    ) {

        return;
    }


    /*
       Stage 0:
       original image only.
    */

    if (
        stage === 0
    ) {

        scene.style.backgroundImage =
            'url("festival-game-bg.png")';

        currentBackgroundStage =
            0;

        return;
    }


    const colour =
        skyColours[
            stage %
            skyColours.length
        ];


    if (!colour) {
        return;
    }


    const original =
        originalBackground.data;


    /*
       Make a completely new copy.

       This prevents colours from
       stacking on top of each other.
    */

    const pixels =
        new Uint8ClampedArray(
            original
        );


    const width =
        backgroundCanvas.width;

    const height =
        backgroundCanvas.height;


    for (
        let y = 0;
        y < height;
        y++
    ) {

        /*
           Only upper sky.
        */

        if (
            y >
            height * 0.48
        ) {

            continue;
        }


        for (
            let x = 0;
            x < width;
            x++
        ) {

            /*
               Protect all HUD areas.
            */

            if (
                isProtectedArea(
                    x,
                    y
                )
            ) {

                continue;
            }


            const index =
                (
                    y * width + x
                ) * 4;


            const r =
                original[index];

            const g =
                original[index + 1];

            const b =
                original[index + 2];


            /*
               Only actual blue sky.
            */

            if (
                !isSkyPixel(
                    r,
                    g,
                    b
                )
            ) {

                continue;
            }


            /*
               Change the sky colour.

               The original brightness and
               texture are retained.
            */

            const amount =
                0.60;


            pixels[index] =
                Math.round(
                    r * (1 - amount) +
                    colour[0] * amount
                );


            pixels[index + 1] =
                Math.round(
                    g * (1 - amount) +
                    colour[1] * amount
                );


            pixels[index + 2] =
                Math.round(
                    b * (1 - amount) +
                    colour[2] * amount
                );
        }
    }


    /*
       Put the newly coloured image
       into the OFFSCREEN canvas.
    */

    backgroundContext.putImageData(
        new ImageData(
            pixels,
            width,
            height
        ),
        0,
        0
    );


    /*
       IMPORTANT:

       The canvas is NOT added to the page.

       Instead, the actual #scene
       background is changed to the
       processed image.
    */

    const imageURL =
        backgroundCanvas.toDataURL(
            "image/png"
        );


    scene.style.backgroundImage =
        `url("${imageURL}")`;


    currentBackgroundStage =
        stage;
}


/* =========================================================
   UPDATE BACKGROUND
========================================================= */

function updateBackgroundColour() {

    if (!backgroundReady) {
        return;
    }


    /*
       EXACTLY every 500 meters.
    */

    const stage =
        Math.floor(
            distance / 500
        );


    /*
       Do nothing until the next
       500 meter boundary.
    */

    if (
        stage ===
        currentBackgroundStage
    ) {

        return;
    }


    createColouredBackground(
        stage
    );
}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

    cancelAnimationFrame(
        animationId
    );


    gameRunning = false;

    paused = false;

    lastTime = 0;


    distance = 0;

    score = 0;

    combo = 1;

    lives = 3;

    speed = 0.52;


    playerY = 0;

    playerVelocity = 0;

    isJumping = false;


    objectId = 0;

    nextSpawnDistance = 180;

    obstacleCount = 0;


    missionProgress = 0;


    modaks = 0;

    durvas = 0;

    flowers = 0;

    diyas = 0;


    obstacleCooldown = 0;


    objects.length = 0;

    objectsContainer.innerHTML =
        "";


    player.style.transform =
        "translateY(0px)";


    continueButton.style.display =
        "none";


    gameOver.style.display =
        "none";


    startScreen.style.display =
        "flex";


    message.classList.remove(
        "show"
    );


    /*
       Always return to the
       original blue background
       when restarting.
    */

    currentBackgroundStage =
        0;


    scene.style.backgroundImage =
        'url("festival-game-bg.png")';


    updateHUD();
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    if (gameRunning) {
        return;
    }


    gameRunning = true;

    paused = false;


    startScreen.style.display =
        "none";


    gameOver.style.display =
        "none";


    continueButton.style.display =
        "none";


    lastTime =
        performance.now();


    showMessage(
        "Ganpati Bappa Morya! 🐘"
    );


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(
    time
) {

    if (!gameRunning) {
        return;
    }


    if (paused) {

        animationId =
            requestAnimationFrame(
                gameLoop
            );

        return;
    }


    const delta =
        Math.min(
            (time - lastTime) /
            16.67,
            2
        );


    lastTime = time;


    updatePlayer(
        delta
    );


    updateWorld(
        delta
    );


    /*
       This only changes the
       background at 500 m boundaries.
    */

    updateBackgroundColour();


    updateHUD();


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


/* =========================================================
   PLAYER JUMP
========================================================= */

function jump() {

    if (!gameRunning) {
        return;
    }


    if (paused) {
        return;
    }


    if (isJumping) {
        return;
    }


    isJumping = true;

    playerVelocity = 15.5;
}


/* =========================================================
   PLAYER PHYSICS
========================================================= */

function updatePlayer(
    delta
) {

    if (
        !isJumping &&
        playerY <= 0
    ) {

        playerY = 0;

        playerVelocity = 0;

        player.style.transform =
            "translateY(0px)";

        return;
    }


    playerVelocity -=
        0.72 * delta;


    playerY +=
        playerVelocity * delta;


    if (
        playerY <= 0
    ) {

        playerY = 0;

        playerVelocity = 0;

        isJumping = false;
    }


    player.style.transform =
        `translateY(${-playerY}px)`;
}


/* =========================================================
   WORLD UPDATE
========================================================= */

function updateWorld(
    delta
) {

    distance +=
        speed *
        delta *
        1.45;


    speed =
        Math.min(
            0.95,
            0.52 +
            distance / 6500
        );


    obstacleCooldown -=
        delta;


    moveObjects(
        delta
    );


    if (
        distance >=
        nextSpawnDistance &&
        obstacleCooldown <= 0
    ) {

        spawnSection();


        nextSpawnDistance =
            distance +
            randomBetween(
                180,
                250
            );


        obstacleCooldown =
            20;
    }
}


/* =========================================================
   SPAWN SECTION
========================================================= */

function spawnSection() {

    obstacleCount++;


    const baseX =
        104;


    const collectibleCount =
        Math.random() < 0.5
            ? 5
            : 6;


    for (
        let i = 0;
        i < collectibleCount;
        i++
    ) {

        const item =
            collectibleTypes[
                Math.floor(
                    Math.random() *
                    collectibleTypes.length
                )
            ];


        const x =
            baseX +
            i * 7.2 +
            Math.random() * 2;


        const y =
            18 +
            Math.random() * 7;


        createObject(
            "collectible",
            item.type,
            item.icon,
            x,
            y,
            item.value
        );
    }


    const obstacleX =
        baseX +
        collectibleCount *
        7.2 +
        9;


    createObject(
        "obstacle",
        "rock",
        "🪨",
        obstacleX,
        15,
        0
    );
}


/* =========================================================
   CREATE OBJECT
========================================================= */

function createObject(
    className,
    type,
    icon,
    x,
    y,
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        `gameObject ${className}`;


    element.dataset.type =
        type;


    element.dataset.value =
        value;


    element.textContent =
        icon;


    element.style.left =
        `${x}%`;


    element.style.bottom =
        `${y}%`;


    const object = {

        id: objectId++,

        element,

        type,

        x,

        y,

        value,

        collected: false

    };


    objects.push(
        object
    );


    objectsContainer.appendChild(
        element
    );
}


/* =========================================================
   MOVE OBJECTS
========================================================= */

function moveObjects(
    delta
) {

    const movement =
        speed *
        delta *
        0.75;


    for (
        let i =
            objects.length - 1;
        i >= 0;
        i--
    ) {

        const object =
            objects[i];


        object.x -=
            movement;


        object.element.style.left =
            `${object.x}%`;


        if (
            !object.collected &&
            checkCollision(
                object
            )
        ) {

            if (
                object.type ===
                "rock"
            ) {

                hitObstacle(
                    object
                );

            } else {

                collectItem(
                    object
                );
            }
        }


        if (
            object.x < -12
        ) {

            object.element.remove();

            objects.splice(
                i,
                1
            );
        }
    }
}


/* =========================================================
   COLLISION DETECTION
========================================================= */

function checkCollision(
    object
) {

    const playerRect =
        player.getBoundingClientRect();


    const objectRect =
        object.element
            .getBoundingClientRect();


    const padding =
        9;


    return !(
        playerRect.right -
            padding <
            objectRect.left ||

        playerRect.left +
            padding >
            objectRect.right ||

        playerRect.bottom -
            padding <
            objectRect.top ||

        playerRect.top +
            padding >
            objectRect.bottom
    );
}


/* =========================================================
   OBSTACLE HIT
========================================================= */

function hitObstacle(
    object
) {

    object.collected =
        true;


    object.element.style.opacity =
        "0";


    lives--;

    combo = 1;


    obstacleCooldown =
        55;


    flashHit();


    showMessage(
        `Ouch! Lives left: ${lives} ❤️`
    );


    if (
        lives <= 0
    ) {

        endGame();

        return;
    }


    updateHUD();
}


/* =========================================================
   COLLECT ITEM
========================================================= */

function collectItem(
    object
) {

    object.collected =
        true;


    object.element.style.transform =
        "scale(1.5)";


    object.element.style.opacity =
        "0";


    score +=
        object.value *
        combo;


    combo =
        Math.min(
            combo + 1,
            9
        );


    missionProgress++;


    if (
        object.type ===
        "modak"
    ) {

        modaks++;
    }


    if (
        object.type ===
        "durva"
    ) {

        durvas++;
    }


    if (
        object.type ===
        "flower"
    ) {

        flowers++;
    }


    if (
        object.type ===
        "diya"
    ) {

        diyas++;
    }


    if (
        missionProgress >=
        missionTarget
    ) {

        score += 100;

        missionProgress = 0;

        showMessage(
            "Mission complete! +100 🎉"
        );

    } else {

        showMessage(
            `+${object.value * combo}`
        );
    }
}


/* =========================================================
   HIT FLASH
========================================================= */

function flashHit() {

    scene.classList.remove(
        "hitFlash"
    );


    void scene.offsetWidth;


    scene.classList.add(
        "hitFlash"
    );


    setTimeout(
        () => {

            scene.classList.remove(
                "hitFlash"
            );

        },
        600
    );
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    distanceValue.textContent =
        `${Math.floor(distance)} m`;


    scoreValue.textContent =
        Math.floor(score);


    comboValue.textContent =
        `x${combo}`;


    livesValue.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(3 - lives);


    speedValue.textContent =
        `${speed.toFixed(1)}x`;


    missionValue.textContent =
        `${missionProgress} / ${missionTarget}`;


    modakValue.textContent =
        modaks;


    durvaValue.textContent =
        durvas;


    flowerValue.textContent =
        flowers;


    diyaValue.textContent =
        diyas;
}


/* =========================================================
   PAUSE
========================================================= */

function pauseGame() {

    if (!gameRunning) {
        return;
    }


    if (paused) {
        return;
    }


    paused = true;


    continueButton.style.display =
        "block";


    showMessage(
        "Game Paused"
    );
}


/* =========================================================
   CONTINUE
========================================================= */

function continueGame() {

    if (!gameRunning) {
        return;
    }


    paused = false;


    continueButton.style.display =
        "none";


    lastTime =
        performance.now();


    showMessage(
        "Run!"
    );
}


/* =========================================================
   RESTART
========================================================= */

function restartGame() {

    resetGame();

    startGame();
}


/* =========================================================
   MAP
========================================================= */

function showMap() {

    if (!gameRunning) {
        return;
    }


    showMessage(
        "Festival Street • Ganesh Darshan →"
    );
}


/* =========================================================
   SOUND
========================================================= */

function toggleSound() {

    soundOn =
        !soundOn;


    soundButton.textContent =
        soundOn
            ? "🔊"
            : "🔇";


    showMessage(
        soundOn
            ? "Sound ON"
            : "Sound OFF"
    );
}


/* =========================================================
   MESSAGE
========================================================= */

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
            () => {

                message.classList.remove(
                    "show"
                );

            },
            1000
        );
}


/* =========================================================
   GAME OVER
========================================================= */

function endGame() {

    gameRunning = false;

    paused = false;


    cancelAnimationFrame(
        animationId
    );


    continueButton.style.display =
        "none";


    finalScore.textContent =
        `Score: ${Math.floor(score)}`;


    heartsLost.textContent =
        "💔💔💔";


    gameOver.style.display =
        "flex";
}


/* =========================================================
   RANDOM NUMBER
========================================================= */

function randomBetween(
    min,
    max
) {

    return (
        Math.random() *
        (max - min) +
        min
    );
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

startButton.addEventListener(
    "click",
    startGame
);

jumpButton.addEventListener(
    "click",
    jump
);

pauseButton.addEventListener(
    "click",
    pauseGame
);

continueButton.addEventListener(
    "click",
    continueGame
);

restartButton.addEventListener(
    "click",
    restartGame
);

mapButton.addEventListener(
    "click",
    showMap
);

soundButton.addEventListener(
    "click",
    toggleSound
);

gameOverRestart.addEventListener(
    "click",
    restartGame
);


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();


            if (!gameRunning) {

                startGame();

            } else {

                jump();
            }
        }


        if (
            event.code === "KeyP" ||
            event.code === "Escape"
        ) {

            if (!paused) {

                pauseGame();

            } else {

                continueGame();
            }
        }
    }
);


/* =========================================================
   TOUCH CONTROL
========================================================= */

scene.addEventListener(
    "touchstart",
    (event) => {

        if (!gameRunning) {
            return;
        }


        if (paused) {
            return;
        }


        if (
            event.target ===
            scene
        ) {

            jump();
        }

    },
    {
        passive: true
    }
);


/* =========================================================
   MUSHAK IMAGE CHECK
========================================================= */

playerImage.addEventListener(
    "error",
    () => {

        showMessage(
            "Mushak image not found"
        );

    }
);


/* =========================================================
   INITIAL SETUP
========================================================= */

loadBackground();

resetGame();
