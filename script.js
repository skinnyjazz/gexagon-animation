//<!--  -->

const cfg = {
    hue: 10,
    bgFillColor: 'rgba(50,50,50,.05',
    dirsCount: 3,
    stepsToTurn: 20,
    doteSize: 2,
    dotsCount: 1000,
    dotVelocity: 3,
    distance: 1000,
    gradientLen: 10,
    gridAngle: 90,
    animationDurationY: 0,
    animationDurationX: 0
}


let onSwing = 0;


let dotsList = [];


const cnv = document.querySelector('canvas');
const ctx = cnv.getContext('2d');
let cw, ch, cx, cy;

function resizeCanvas() {
    cw = cnv.width = innerWidth;
    ch = cnv.height = innerHeight;
    cx = cw / 2;
    cy = ch / 2;
}
resizeCanvas();

window.addEventListener('resize', resizeCanvas);

let pause = false;

const modeCfg = {
    fillW: cw,
    fillH: ch,


}


function app() {

    function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gco) {
        ctx.globalCompositeOperation = gco;
        ctx.shadowColor = shadowColor || 'black';
        ctx.shadowBlur = shadowBlur || 1;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);

    }
    class Dot {
        constructor() {
            this.pos = { x: cx, y: cy };
            this.dir = cfg.dirsCount === 6 ? (Math.random() * 3 | 0) * 2 :
                Math.random() * cfg.dirsCount | 0;
            this.step = 0;
        }
        redrawDot() {
            let xy = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy);
            let makeHue = (cfg.hue + xy / cfg.gradientLen) % 360;
            // let blur = cfg.doteSize - Math.sin(xy / 8) * 2;
            let size = 0
            let color = `hsl(${makeHue}, 100%, 50%)`;
            if (onSwing == 0) {
                size = cfg.doteSize;
            } else {
                size = cfg.doteSize - Math.sin(xy / 3.14) * 2 - Math.sin(xy / 3.14);
            }
            let x = this.pos.x - size / 2;
            let y = this.pos.y - size / 2;

            drawRect(color, x, y, size, size, color, blur, `lighter`);
        }
        moveDot() {
            this.step++;
            this.pos.x += dirsList[this.dir].x * cfg.dotVelocity - cfg.animationDurationX;
            this.pos.y += dirsList[this.dir].y * cfg.dotVelocity - cfg.animationDurationY;

        }
        changeDir() {
            if (this.step % cfg.stepsToTurn === 0) {
                this.dir = Math.random() > .5 ? (this.dir + 1) % cfg.dirsCount : (this.dir + cfg.dirsCount - 1) % cfg.dirsCount;
            }
        }
        killDot(id) {
            let percent = Math.random() * Math.exp(this.step / cfg.distance);
            if (percent > 100) {
                dotsList.splice(id, 1);
            }
        }

    }
    let dirsList = [];

    function createDirs() {
        for (let i = 0; i < 360; i += 360 / cfg.dirsCount) {
            let angle = cfg.gridAngle + i;
            let x = Math.cos(angle * Math.PI / 180);
            let y = Math.sin(angle * Math.PI / 180);
            dirsList.push({ x: x, y: y });
        }
    }
    createDirs();



    function addDot() {
        if (dotsList.length < cfg.dotsCount && Math.random() > .8) {
            dotsList.push(new Dot());
            cfg.hue = (cfg.hue + 1) % 360;
        }
    }

    function refreshDots() {
        dotsList.forEach((i, id) => {
            i.moveDot();
            i.redrawDot();
            i.changeDir();
            i.killDot(id);
        })
    }



    function loop() {
        if (pause) {
            isPauseTrue()
            clearConvas()
            return
        }


        drawRect(cfg.bgFillColor, 0, 0, modeCfg.fillW, ch, 0, 0, 'normal'); // drawRect(cfg.bgFillColor, 0, 0, cw, ch, 0, 0, 'normal'); 
        addDot(); //                                   0  0
        refreshDots();

        requestAnimationFrame(loop);



    }

    loop();


}
app();




// menue
let inputsInfo = document.querySelectorAll('input');

function getInfo() {
    let newCfg = {};
    for (let i = 0; i < inputsInfo.length; i++) {
        newCfg[inputsInfo[i].className] = inputsInfo[i].value;

    }

    return newCfg;
}


function configMenu() {
    let newCfg = getInfo();

    for (let i in newCfg) {
        for (let j in newCfg) {
            if (newCfg[j] != "" && j == i) {

                cfg[i] = Number(newCfg[i]);
            }
        }

    }

}


function clearConvas() {

    ctx.clearRect(0, 0, cnv.width, cnv.height);
    dotsList = [];
    console.log(dotsList);
}

function isPauseTrue() {
    if (pause == true) {
        pause = false
    } else pause = true;
}





let submitBtn = document.querySelector('.submit');

function submitSetings() {
    submitBtn.addEventListener('click', () => {
        window.addEventListener('resize', resizeCanvas);

        configMenu();
        app();
        isPauseTrue();
    })
}
submitSetings();

// menue modes

let modeChangerFilling = document.querySelector('#filling');
let modeChangerdisappearing = document.querySelector('#disappearing');
let randomiser = document.querySelector('#randomiser');
let modeChangerBlinking = document.querySelector('#blinking');
let modeChangerSwinging = document.querySelector('#swinging')

// function modeChangerblinking() {
//     function headsAndtails() {
//         let headsAndtails = getRandom(0, 2);

//         return headsAndtails;
//     }

//     modeChangerBlinking.addEventListener('click', () => {
//         modeChangerdisappearing.classList.remove('active');
//         modeChangerFilling.classList.remove('active');
//         modeChangerBlinking.classList.add('active');
//         for (let i = 0; i < 20; i++) {
//             if (headsAndtails() == 0) {
//                 setTimeout(modeCfg.fillW = 0, 1000);
//             } else if (headsAndtails() == 1) {
//                 setTimeout(modeCfg.fillW = cw, 1000);
//             }

//         }


//     })
// }
// modeChangerblinking();

function changeModeToFilling() {
    modeChangerFilling.addEventListener('click', () => {
        modeChangerFilling.classList.add('active');
        modeChangerdisappearing.classList.remove('active');
        modeChangerBlinking.classList.remove('active');


        modeCfg.fillW = 0;
    })
}
changeModeToFilling();


function changeModeToSwinging() {
    modeChangerSwinging.addEventListener('click', () => {
        if (modeChangerSwinging.classList[1] == 'active') {
            modeChangerSwinging.classList.remove('active');
            onSwing--;
        } else if (modeChangerSwinging.classList[1] != 'active') {
            modeChangerSwinging.classList.add('active');
            onSwing++;
        }
        console.log(onSwing)
    })
}

changeModeToSwinging();



function changeModeTodisappearing() {
    modeChangerdisappearing.addEventListener('click', () => {
        modeChangerdisappearing.classList.add('active');
        modeChangerFilling.classList.remove('active');
        modeChangerBlinking.classList.remove('active');

        modeCfg.fillW = cw;
    })
}
changeModeTodisappearing()

function setRandomSetings() {
    let newCfg = getInfo();
    console.log(inputsInfo)
    randomiser.addEventListener('click', () => {
        inputsInfo[0].value = getRandom(3, 100);
        inputsInfo[1].value = getRandom(1, 100);
        inputsInfo[2].value = getRandom(1, 100);
        inputsInfo[3].value = getRandom(1, 2000);
        inputsInfo[4].value = getRandom(1, 6);
        inputsInfo[5].value = getRandom(50, 1000);
        inputsInfo[6].value = getRandom(0, 360);
        // inputsInfo[7].value = getRandom(-5, 5);
        // inputsInfo[8].value = getRandom(-5, 5);


        configMenu();
        app();
        isPauseTrue();
    })

}
setRandomSetings();

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

console.log(getRandom(0, 10));

// close menu
let close = document.querySelector('.close');
let menu = document.querySelector('.animation-menu');
let q = document.querySelector('.openMenu');

function closeMenu() {
    close.addEventListener('click', () => {
        menu.style.display = "none";
        console.log(6)

    })
}

closeMenu()

function openMenu() {
    q.addEventListener('click', () => {
        menu.style.display = "flex";

        console.log(6)
    })
}

openMenu()