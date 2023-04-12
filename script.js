let canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d"); 
Resize(); 

class Grass 
{
    constructor() {
        this.image = new Image();
        this.image.src = "img/trava.png";

        this.x = 0;
        this.y = canvas.height;
    }

    update() {
        this.y = canvas.height - this.image.height;
    }
}

class Tree
{
    constructor() {
        this.image = new Image();
        this.image.src = "img/derevo.png";

        this.x = canvas.width * 0.08;
        this.y = canvas.height;
    }

    update() {
        this.y = canvas.height - (tree.image.height + (0.45 * this.image.height));
    }
}

class Duck
{
    constructor(x, y, coefficient_speed, hp) {
        this.image = new Image();

        this.x = x;
        this.y = y;

        this.coefficient_speed = coefficient_speed;
        this.hp = hp;

        this.coordX = this.x;
        this.coordY = this.y;

        this.timerId;

        this.fly_anim = false;
        this.moment_shoot_anim = false;
        this.down_anim = false;

        this.arrAnimationFly = null;

        this.shot_down = false;

        this.grass_level = false;

        this.quacking_audio = new Audio('audio/duck_quacking.mp3');
    }

    update(frame_rate, speed_duck) {
        if (!this.shot_down) {
            this.fly(speed_duck, frame_rate);
        } else {
            if (this.fly_anim) {
                this.fly_anim = false;
                clearTimeout(this.timerId);
            }

            if (!this.moment_shoot_anim) {
                if (this.down_anim) {
                    this.y += 3;
                } else {
                    this.momentShooting(frame_rate);
                }  
            }
        }
    }

    fly(speed_duck, speed_frame) {
        if (this.x != this.coordX || this.y != this.coordY) {
            let dx = this.coordX - this.x;
            let dy = this.coordY - this.y;
            let d = Math.sqrt(dx*dx + dy*dy);

            if (d <= speed_duck * this.coefficient_speed) {
              this.x = this.coordX;
              this.y = this.coordY;
            } else {
              this.x += speed_duck * this.coefficient_speed * dx / d;
              this.y += speed_duck * this.coefficient_speed * dy / d;
            }

        } else {
            this.coordX = this.random(0, canvas.width - this.image.width);
            this.coordY = this.random(0, canvas.height - (grass.image.height / 2));
            this.quacking_audio.play();
            this.selectAnimationFly();
            clearTimeout(this.timerId);
            this.fly_anim = false;
        }

        if (!this.fly_anim) {
            this.flyAnimation(...this.arrAnimationFly, speed_frame);
        }
    }

    selectAnimationFly() {
        if (this.coordX <= this.x) {
            if (this.coordY - this.y <= this.image.height && this.coordY - this.y >= -this.image.height) {
                this.arrAnimationFly = this.straight_left_fly;
            } else {
                this.arrAnimationFly = this.diagonally_left_fly;
            }
        } else {
            if (this.coordY - this.y <= this.image.height && this.coordY - this.y >= -this.image.height) {
                this.arrAnimationFly = this.straight_right_fly;
            } else {
                this.arrAnimationFly = this.diagonally_right_fly;
            }
        }
    }

    flyAnimation (up, mid, down, frame_rate) {
        this.fly_anim = true;

        this.timerId = setTimeout(function animation(frame, frame_rate, up, mid, down) {
            if (frame == 1) {
                this.image.src = mid;
                this.timerId = setTimeout(animation.bind(this), (frame_rate / 2), frame + 1, frame_rate, up, mid, down);
            } else if (frame == 2) {
                this.image.src = up;
                this.timerId = setTimeout(animation.bind(this), frame_rate, frame + 1, frame_rate, up, mid, down);
            } else {
                this.image.src = down;
                this.timerId = setTimeout(() => {this.fly_anim = false}, frame_rate);
            }
        }.bind(this), 0, 1, frame_rate, up, mid, down);
    }

    momentShooting (frame_rate) {
        this.moment_shoot_anim = true;

        this.timerId = setTimeout(function animation(frame_rate) {
            if (this.random(0,1)) {
                this.image.src = this.arrDead[2];
            } else {
                this.image.src = this.arrDead[3];
            }

            this.timerId = setTimeout(function() {
                this.moment_shoot_anim = false; 
                this.fallingDownAnim(200)
            }.bind(this), frame_rate);

        }.bind(this), 0, frame_rate);
    }

    fallingDownAnim (frame_rate) {
        this.down_anim = true;

        this.timerId = setTimeout(function animation(frame, frame_rate) {
            if (this.y >= canvas.height - (grass.image.height / 2)) {
                this.down_anim = false;
                this.grass_level = true;
            } else {
                if (frame == 1) {
                    this.image.src = this.arrDead[0];
                    this.timerId = setTimeout(animation.bind(this), frame_rate, frame + 1, frame_rate);
                } else {
                    this.image.src = this.arrDead[1];
                    this.timerId = setTimeout(animation.bind(this), frame_rate, frame - 1, frame_rate);
                }
            }
        }.bind(this), 0, 1, frame_rate)
    }

    fly_of_loss(coordX, coordY, speed_duck, speed_frame) {
        this.coordX = coordX;
        this.coordY = coordY;
        this.fly(speed_duck, speed_frame);
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

class RedDuck extends Duck
{
    constructor(x, y, speed, hp) {
        super(x, y, speed, hp);

        this.image.src = 'img/red_duck/diagonally_left/left_up.png';

        this.diagonally_left_fly = [
            'img/red_duck/diagonally_left/left_up.png',
            'img/red_duck/diagonally_left/left_mid.png',
            'img/red_duck/diagonally_left/left_down.png'
        ];

        this.diagonally_right_fly = [
            'img/red_duck/diagonally_right/right_up.png',
            'img/red_duck/diagonally_right/right_mid.png',
            'img/red_duck/diagonally_right/right_down.png'
        ];

        this.straight_left_fly = [
            'img/red_duck/straight_left/left_up.png',
            'img/red_duck/straight_left/left_mid.png',
            'img/red_duck/straight_left/left_down.png'
        ];

        this.straight_right_fly = [
            'img/red_duck/straight_right/right_up.png',
            'img/red_duck/straight_right/right_mid.png',
            'img/red_duck/straight_right/right_down.png'
        ];

        this.arrDead = [
            'img/red_duck/dead/down_left.png',
            'img/red_duck/dead/down_right.png',
            'img/red_duck/dead/shot_left.png',
            'img/red_duck/dead/shot_right.png',
        ];
    }
}

class BlackDuck extends Duck
{
    constructor(x, y, speed, hp) {
        super(x, y, speed, hp);

        this.image.src = 'img/black_duck/diagonally_left/left_up.png';

        this.diagonally_left_fly = [
            'img/black_duck/diagonally_left/left_up.png',
            'img/black_duck/diagonally_left/left_mid.png',
            'img/black_duck/diagonally_left/left_down.png'
        ];

        this.diagonally_right_fly = [
            'img/black_duck/diagonally_right/right_up.png',
            'img/black_duck/diagonally_right/right_mid.png',
            'img/black_duck/diagonally_right/right_down.png'
        ];

        this.straight_left_fly = [
            'img/black_duck/straight_left/left_up.png',
            'img/black_duck/straight_left/left_mid.png',
            'img/black_duck/straight_left/left_down.png'
        ];

        this.straight_right_fly = [
            'img/black_duck/straight_right/right_up.png',
            'img/black_duck/straight_right/right_mid.png',
            'img/black_duck/straight_right/right_down.png'
        ];

        this.arrDead = [
            'img/black_duck/dead/down_left.png',
            'img/black_duck/dead/down_right.png',
            'img/black_duck/dead/shot_left.png',
            'img/black_duck/dead/shot_right.png',
        ];
    }
}

class Dog
{
    constructor() {
        this.image = new Image();
        this.image.src = 'img/dog/direct_right/dog_frame1.png';

        this.step_right = [
            'img/dog/direct_right/dog_frame1.png',
            'img/dog/direct_right/dog_frame2.png',
            'img/dog/direct_right/dog_frame3.png',
            'img/dog/direct_right/dog_frame4.png',
            'img/dog/direct_right/dog_frame_sniff.png',
        ];

        this.step_left = [
            'img/dog/direct_left/dog_frame1.png',
            'img/dog/direct_left/dog_frame2.png',
            'img/dog/direct_left/dog_frame3.png',
            'img/dog/direct_left/dog_frame4.png',
            'img/dog/direct_left/dog_frame_sniff.png',
        ];

        this.left_jump = [
            'img/dog/left_jump/jump1.png',
            'img/dog/left_jump/jump2.png',
            'img/dog/left_jump/ready_to_jump.png',
            -1,
            1
        ];

        this.right_jump = [
            'img/dog/right_jump/jump1.png',
            'img/dog/right_jump/jump2.png',
            'img/dog/right_jump/ready_to_jump.png',
            1,
            -1
        ];

        this.duck = [
            'img/dog/duck/black_duck.png',
            'img/dog/duck/red_duck.png',
            'img/dog/duck/red_black_duck.png',
            'img/dog/duck/two_black_duck.png',
            'img/dog/duck/two_red_duck.png',
        ];

        this.arrMockery = [
            'img/dog/mockery/mockery_one.png',
            'img/dog/mockery/mockery_two.png'
        ];

        this.x = -1 * (110 - mashtab(110));
        this.y = canvas.height - (grass.image.height / 1.7);

        this.timerId;

        this.move_anim = false;
        this.sniff_anim = false;
        this.jump_anim = false;

        this.jump_up_anim = false;
        this.jump_down_anim = false;

        this.direct = true;

        this.arrJump;
        this.bg_jump = true;
        this.end_jump = false;

        this.duck_lifting = false;

        this.mockery_anim = false;

        this.sniff_audio = new Audio('audio/sniff_dog.m4a');
        this.barking_audio = new Audio('audio/dog_barking.mp3');
    }

    update(start_move, start_jump, end_jump, frame_rate, speed_move) {
        if (start_move && !start_jump) {
            this.move(frame_rate, speed_move);

        } 

        if (start_jump && !end_jump) {
            if (this.jump_anim) {
                if (this.jump_up_anim) {
                    this.y -= 1;
                    this.x += 0.5 * this.arrJump[3];
                } 
                
                if (this.jump_down_anim) {
                    this.y += 1;
                    this.x += (1 / 6) * this.arrJump[3];

                    if (this.y >= canvas.height - (grass.image.height / 2)) {
                        clearTimeout(this.timerId);
                        this.jump_anim = false;
                        this.jump_down_anim = false;
                        this.end_jump = true;
                    }
                }  
            } else {
                this.preparationJump(frame_rate, speed_move);
            }
        }
    }

    move(frame_rate, speed_move) {
        this.y = canvas.height - (grass.image.height / 1.7);
        
        if (this.direct) {

            if (!this.move_anim) {
                this.moveAnimation(...this.step_right, frame_rate, speed_move);
            }

            if (!this.sniff_anim) {
                this.x += speed_move;
            }
        } else {

            if (!this.move_anim) {
                this.moveAnimation(...this.step_left, frame_rate, -speed_move);
            }
            
            if (!this.sniff_anim) {
                this.x -= speed_move;
            }
        }

        if (this.x > canvas.width || this.x <= (110 - mashtab(110)) * (-1)) {
            this.direct = !this.direct;
            clearTimeout(this.timerId);
            this.move_anim = false;
        }
    }

    moveAnimation (frame1, frame2, frame3, frame4, frame_sniff, frame_rate) {
        this.move_anim = true;

        this.timer_id = setTimeout(function animation(frame, frame_rate, frame1, frame2, frame3, frame4, frame_sniff) {
            switch (frame) {
                case 1:
                case 5:
                    this.image.src = frame1;
                    break;
                case 2:
                    this.image.src = frame2;
                    break;
                case 3:
                    this.image.src = frame3;
                    break;
                case 10:
                    this.image.src = frame3;
                    this.sniff_anim = false;
                    break;
                case 4:
                    this.image.src = frame4;
                    break;
                case 11:
                    this.image.src = frame4;
                    this.timerId = setTimeout(() => {this.move_anim = false}, frame_rate);
                    break;
                case 6:
                    this.image.src = frame_sniff;
                    this.sniff_audio.play();
                    this.sniff_anim = true;
                    break;
                case 8:
                    this.image.src = frame_sniff;
                    break;
                case 7:
                case 9:
                    this.image.src = frame2;
                    break;
            }

            if (frame != 11) {
                this.timerId = setTimeout(animation.bind(this), frame_rate, frame + 1, frame_rate, frame1, frame2, frame3, frame4, frame_sniff);
            }
        }.bind(this), 0, 1, frame_rate, frame1, frame2, frame3, frame4, frame_sniff)
    }

    preparationJump(frame_rate, speed_move) {
        if (this.x < 0 || this.x + this.image.width >= canvas.width) {
            dog.move(frame_rate, speed_move);
        } else {
            if (this.x <= canvas.width / 2) {
                this.arrJump = this.right_jump;
            } else {
                this.arrJump = this.left_jump;
            }
            clearTimeout(this.timerId);
            this.move_anim = false;
            this.jumpAnimation(frame_rate);
        }
    }

    jumpAnimation(frame_rate) {
        this.jump_anim = true;

        this.timerId = setTimeout(function animation(frame, frame_rate) {
            if (frame == 1) {
                this.image.src = this.arrJump[2];
                this.barking_audio.play();
                this.timerId = setTimeout(animation.bind(this), frame_rate, frame + 1, frame_rate);
            } else if (frame == 2) {
                this.jump_up_anim = true;
                this.image.src = this.arrJump[0];
                this.timerId = setTimeout(animation.bind(this), frame_rate*3, frame + 1, frame_rate);
            } else if (frame == 3) {
                this.jump_up_anim = false;
                this.jump_down_anim = true;
                this.image.src = this.arrJump[1];
                this.bg_jump = false;
                this.timerId = setTimeout(animation.bind(this), frame_rate, frame, frame_rate);
            }
        }.bind(this), 0, 1, frame_rate)
    }

    duckLiftingAnim (x_duck, src, timer) {
        this.y = canvas.height - (grass.image.height * 2/3);
        this.x = x_duck;
        this.image.src = src;
        this.duck_lifting = true;

        this.timerId = setTimeout(function animation(px, frame, timer) {
            if (frame == 1) {
                this.y -= px;
                if (this.y + this.image.height > canvas.height - (grass.image.height * 0.6)) {
                    this.timerId = setTimeout(animation.bind(this), timer, px, frame, timer);
                } else {
                    this.timerId = setTimeout(animation.bind(this), timer*6, 3, frame + 1, timer);
                }
            } else if (frame == 2) {
                this.y += px;
                if (this.y < canvas.height - (grass.image.height / 2)) {
                    this.timerId = setTimeout(animation.bind(this), timer, px, frame, timer);
                } else {
                    this.duck_lifting = false;
                }
            }
        }.bind(this), 0, 5, 1, timer);
    }

    mockery() {
        this.image.src = this.arrMockery[0];
        this.y = canvas.height - (grass.image.height * 2/3);
        this.x = (canvas.width / 2) - (this.image.width / 2);
        this.mockery_anim = true;

        this.timerId = setTimeout(function animation(px, frame, timer, src, count) {
            if (src) {
                this.image.src = this.arrMockery[1];
            } else {
                this.image.src = this.arrMockery[0];
            }
            src = !src;

            if (frame == 1) {
                this.y -= px;
                if (this.y + this.image.height > canvas.height - (grass.image.height * 0.6)) {
                    this.timerId = setTimeout(animation.bind(this), timer, px, frame, timer, src, count);
                } else {
                    this.timerId = setTimeout(animation.bind(this), timer, 5, frame + 1, timer, src, count);
                }
            } else if (frame == 2) {
                if (count < 5) {
                    this.timerId = setTimeout(animation.bind(this), timer, px, frame, timer, src, count+1);
                } else {
                    this.timerId = setTimeout(animation.bind(this), timer, 5, frame + 1, timer, src, count);
                }

            } else {
                this.y += px;
                if (this.y < canvas.height - (grass.image.height / 2)) {
                    this.timerId = setTimeout(animation.bind(this), timer, px, frame, timer, src, count);
                } else {
                    this.mockery_anim = false;
                }
            }
            
        }.bind(this), 0, 10, true, 100, true, 1);
    }
}

let grass = new Grass();
let tree = new Tree();
let dog = new Dog();
let cartridges = new Image();
cartridges.src = 'img/cartridges.png';
let free_duck = new Image();
free_duck.src = 'img/free_duck.png';
let shooting_duck = new Image();
shooting_duck.src = 'img/shooting_duck.png';

let arrDuck = [];
let arrDuckShooting = [];

let requestId;

let round = [
    {count: 2, speed: 1, hp: 1, time: 10},
    {count: 3, speed: 1, hp: 1, time: 10},
    {count: 4, speed: 2, hp: 1, time: 15},
    {count: 5, speed: 2, hp: 1, time: 10},
    {count: 5, speed: 3, hp: 5, time: 10},
];
let numRound = 0;
let mockery_round = false;
let start_round = true;
let start_time_round = 0;
let end_round = round.length;

let start_pause = true;
let introAnimation = true;
let start_dog = false;
let start_game = false;

let shot = {};

let scrore = 0;
let count_cartridges = 0;

let count_free_duck = 0;
let count_shooting_duck = 0;

let soundtrack = new Audio('audio/soundtrack.mp3');
let dog_laughs = new Audio('audio/dog_laughs.mp3');

let time = 0;
let start_time = false;
let timerId;
let sec = 0;
let min = 0;
let time_round = 0;

let loss_game = false;

let past_perform = 0;
let update_frequency = 0;

let flashing = 0;

window.addEventListener("keydown", KeyDown);
window.addEventListener("click", (event) => {if (start_pause) clickShot(event)});

function Resize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function KeyDown(e){ 
    switch(e.keyCode)
    {
        case 27: //Esc
            start_pause = !start_pause;
            if (start_pause) {
                startAnimation();
            } else {
                stopAnimation();
            }
            break;
    }
}

function clickShot(click) {
    if (start_game && !loss_game && !mockery_round){
        let shot_audio = new Audio('audio/shot.mp3');

        shot_audio.play();
        shot = {
            x: click.pageX,
            y: click.pageY
        }
        count_cartridges -= 1;
    }

    if (!start_game && !introAnimation) {
        start_game = true; 
    } 

    if (loss_game && !dog.mockery_anim && !mockery_round) {
        start_game = false;
        loss_game = false;
        canvas.classList.add('canvas--blue');
        dog = new Dog();
        numRound = 0;
        sec = 0;
        min = 0; 
        count_free_duck = 0;
        count_shooting_duck = 0; 
    }

    if (numRound == end_round && loss_game) {
        let shot_audio = new Audio('audio/shot.mp3');
        shot_audio.play();
        shot = {
            x: click.pageX,
            y: click.pageY
        }
    }
}

function mashtab(arg) {
    let percentDiff = 100 - (canvas.width / (grass.image.width / 100));
    return (arg / 100) * percentDiff;
}

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function intro(speedFrame) {
    tree.y -= speedFrame;

    if (tree.y + (tree.image.height / 1.4) < canvas.height) {
        grass.y = tree.y + (tree.image.height / 1.4)
    }

    if (grass.y <= canvas.height - grass.image.height) {
        introAnimation = false; 
    }
}

function push_arrDuck(round) {
    for (i = 0; i < round.count; i++) {
        if(randomInteger(0,1)) {
            arrDuck.push(new RedDuck(canvas.width / 2, canvas.height - (grass.image.height / 2), round.speed, round.hp))
        } else {
            arrDuck.push(new BlackDuck(canvas.width / 2, canvas.height - (grass.image.height / 2), round.speed, round.hp));
        }
    }
    count_free_duck = round.count;
}

function shootingDuck(duck) {
    if ((shot.x >= duck.x && shot.x <= duck.x + duck.image.width - mashtab(duck.image.width)) &&
        (shot.y >= duck.y && shot.y <= duck.y + duck.image.height)) {
        duck.hp -= 1;

        if (duck.hp <= 0) {
            duck.shot_down = true;
            duck.timerAnimation = 0;

            let headshot = new Audio('audio/boomheadshot.mp3');
            let est_probitie = new Audio('audio/est_probitie.mp3');

            if (randomInteger(0,1)) {
                headshot.play();
            } else {
                est_probitie.play();
            }

            count_free_duck -= 1;
            count_shooting_duck += 1;
        } else {
            let ne_probil = new Audio('audio/ne_probil.mp3');
            ne_probil.play();
        }
    }
}

function shootingDog() {
    if ((shot.x >= dog.x && shot.x <= dog.x + dog.image.width - mashtab(dog.image.width)) &&
    (shot.y >= dog.y && shot.y <= dog.y + dog.image.height)) {
        window.open('addsite/index.html');
        setTimeout(() => window.close(), 100);
    }
}

function music() {
    if (!start_game) {
        soundtrack.play();
    } else {
        soundtrack.pause();
    }
}

function timer() {
    timerId = setTimeout(() => {
        sec++;
        if (sec >= 60) {
            sec = 0;
            min++
        }
        timerId = setTimeout(timer, 1000)
    }, 1000);
}

function stopTimer() {
    clearTimeout(timerId);
    start_time = false;
}

function drawHeader(px) {
    ctx.fillStyle = 'white';
    ctx.font = `${px}px sans-serif`;

    let width = ctx.measureText('duckhunt2023').width;
    let height = 266;

    let x = (canvas.width / 2) - (width / 2);
    let y = (canvas.height / 2) - (height / 2);

    ctx.fillText('Duck', x, y)
    ctx.fillText('Hunt', x + ctx.measureText('duck').width - 2, y + (height / 3))
    ctx.fillText('2023', x + ctx.measureText('duckhunt').width - 2, y + (height * 2/3) - 2)
}

function drawTimeScrore(px) {
    ctx.fillStyle = 'white';
    ctx.font = `${px}px sans-serif`;

    let widthTime = ctx.measureText(`${min > 9 ? min : '0' + min} : ${sec > 9 ? sec : '0' + sec}`).width;
    let widthScrore = ctx.measureText(`Scrore: ${scrore}`).width;

    ctx.strokeText(`${min > 9 ? min : '0' + min} : ${sec > 9 ? sec : '0' + sec}`, canvas.width - widthTime - (px / 2), px + (px / 2));

    ctx.strokeText(`Scrore: ${scrore}`, canvas.width - widthScrore - (px / 2), (px * 2) + (px / 2));
}

function drawRound(px) {
    ctx.fillStyle = 'white';
    ctx.font = `${px}px sans-serif`;

    let width = ctx.measureText(`Round ${numRound} / 5`).width;

    ctx.fillText(`Round ${numRound} / ${round.length}`, canvas.width - width - (px / 2), canvas.height - (px / 2))
}

function drawLoss(px) {
    ctx.fillStyle = 'white';
    ctx.font = `${px}px sans-serif`;

    let width = ctx.measureText(`You Loss`).width;

    ctx.fillText(`You Loss`, (canvas.width / 2) - (width / 2), (canvas.height / 2) - (px / 2))
}

function drawText(text) {
    ctx.fillStyle = 'white';
    ctx.font = `30px sans-serif`;

    let width = ctx.measureText(text).width;

    ctx.strokeText(text, (canvas.width / 2) - (width / 2), canvas.height - (grass.image.height * 0.4))
}

function drawDuckCount() {
    let pastX_free_duck = free_duck.width / 2;
    for (let i = 0; i < count_free_duck; i++) {
        ctx.drawImage(
            free_duck,
            pastX_free_duck,
            canvas.height - free_duck.height - free_duck.width / 2,
            free_duck.width - mashtab(free_duck.width),
            free_duck.height
        );
        pastX_free_duck += free_duck.width + (free_duck.width / 2)
    }

    let pastX_shooting_duck = shooting_duck.width / 2;
    for (let i = 0; i < count_shooting_duck; i++) {
        ctx.drawImage(
            shooting_duck,
            pastX_shooting_duck,
            canvas.height - (shooting_duck.height * 3),
            shooting_duck.width - mashtab(shooting_duck.width),
            shooting_duck.height
        );
        pastX_shooting_duck += shooting_duck.width + (shooting_duck.width / 2);
    }
}

function drawCartridges() {
    let pastX = cartridges.width / 2;
    for (let i = 0; i < count_cartridges; i++) {
        ctx.drawImage(
            cartridges,
            pastX,
            cartridges.width / 2,
            cartridges.width - mashtab(cartridges.width),
            cartridges.height
        );
        pastX += cartridges.width + (cartridges.width / 2);
    }
}

function flashingText(text) {
    flashing++;
    if (flashing <= 150) {
        drawText(text);
    }

    if (flashing >= 400) {
        flashing = 0;
    }
}

function startAnimation(){
    requestId = requestAnimationFrame(update);
    soundtrack.play();
}

function stopAnimation(){
    cancelAnimationFrame(requestId);
    soundtrack.pause();
    stopTimer();

}

function update() {
    window.addEventListener("resize", Resize); 

    update_frequency = performance.now() - past_perform;
    past_perform = performance.now();

    let speedx2 = 2;
    let frame_rate = 30;
    let speedx05 = 0.5;

    if (update_frequency > 10) {
        speedx2 = speedx2 * 2;
        frame_rate = frame_rate - (frame_rate / 2);
        speedx05 = speedx05 * 2;
    }

    if (introAnimation) {
        intro(speedx05);
        dog.x = -1 * (100 - mashtab(100));
        dog.y = canvas.height - (grass.image.height / 1.7);
    } else {
        grass.update();
        tree.update();
    }

    music();

    dog.update(!introAnimation, start_game, dog.end_jump, 200, speedx05);

    if (dog.end_jump) {
        if (start_round) {
            start_time_round = sec;
            start_round = false;
        }

        if (!start_time) {
            timer();
            start_time = true;
        }   
        
        if (!arrDuck.length && !loss_game && !dog.mockery_anim && !mockery_round && !dog.duck_lifting && !arrDuckShooting.length) {
            if (numRound > round.length - 1) {
                let count, speed;
                if (randomInteger(0, 1000) == 1000) {
                    count = 100;
                    speed = 100;
                } else {
                    count = randomInteger(1,10);
                    speed = randomInteger(1, 10);
                }
                let time = count * speed * 2; 
                push_arrDuck({count: count, speed: speed, hp: 1, time: time});
                time_round = time;
            } else {
                push_arrDuck(round[numRound]);
                time_round = round[numRound].time;
            }
            count_cartridges = arrDuck.length + 1;
            numRound += 1;
            start_time_round = sec;
            count_shooting_duck = 0;
        }

        for (let i = 0; i < arrDuck.length; i++) {
            if (Object.entries(shot).length) {
                shootingDuck(arrDuck[i]);
            }
            arrDuck[i].update(180, speedx2);

            if (arrDuck[i].grass_level) {
                arrDuckShooting.push(arrDuck[i]);
                arrDuck.splice(i, 1);
            }
        }

        if (numRound == end_round) {
            shootingDog();
        }

        shot = {};

        if (!dog.duck_lifting && arrDuckShooting.length) {
            if (arrDuckShooting.length >= 2) {
                if (arrDuckShooting[0] instanceof RedDuck) {
                    if (arrDuckShooting[1] instanceof RedDuck) {
                        dog.duckLiftingAnim(arrDuckShooting[0].x, dog.duck[4], 30);
                    } else {
                        dog.duckLiftingAnim(arrDuckShooting[0].x, dog.duck[2], 30);
                    }
                } else {
                    if (arrDuckShooting[1] instanceof RedDuck) {
                        dog.duckLiftingAnim(arrDuckShooting[0].x, dog.duck[2], 30);
                    } else {
                        dog.duckLiftingAnim(arrDuckShooting[0].x, dog.duck[3], 30);
                    }
                }
                arrDuckShooting.splice(0, 2);
                scrore += 2;
            } else {
                if (arrDuckShooting[0] instanceof RedDuck) {
                    dog.duckLiftingAnim(arrDuckShooting[0].x, dog.duck[1], 30);
                } else {
                    dog.duckLiftingAnim(arrDuckShooting[0].x, dog.duck[0], 30);
                }
                arrDuckShooting.splice(0, 1);
                scrore += 1;
            }  
   
            let shows_ducks = new Audio('audio/shows_ducks.mp3');
            shows_ducks.play();       
        }
    }

    if ((sec - start_time_round >= time_round && arrDuck.length) || (count_cartridges <= 0 && arrDuck.filter(el => el.shot_down).length < arrDuck.length)) {

        if (count_free_duck > count_shooting_duck) {
            loss_game = true;
            canvas.className = 'canvas--red';
        }
            
        for (let i = 0; i < arrDuck.length; i++) {
            if (!arrDuck[i].shot_down) {
                arrDuck[i].fly_of_loss(arrDuck[i].x, -arrDuck[i].image.height, speedx2, frame_rate);
            }
            
            if (arrDuck[i].y <= -arrDuck[i].image.height) {
                arrDuck.splice(i, 1);
            }
        }

        if (!mockery_round && !dog.mockery_anim) {
            mockery_round = true;
        }       
    } 

    if (mockery_round) {
        if (!dog.mockery_anim && !dog.duck_lifting && (arrDuck.filter((el) => el.shot_down).length == 0)) {
            mockery_round = false;
            dog_laughs.play();
            dog.mockery();
        }
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        tree.image,
        tree.x,
        tree.y,
        tree.image.width - mashtab(tree.image.width),
        tree.image.height
    );

    for (let duck of arrDuck) {
        ctx.drawImage(duck.image, duck.x, duck.y, duck.image.width - mashtab(duck.image.width), duck.image.height);
    }

    if(dog.bg_jump) {
        ctx.drawImage(
            grass.image,
            grass.x,
            grass.y,
            grass.image.width - mashtab(grass.image.width),
            grass.image.height
        );

        if(!introAnimation && !start_game) {
            flashingText(`Please Click to start`);
        }
    
        ctx.drawImage(
            dog.image, 
            dog.x, 
            dog.y, 
            dog.image.width - mashtab(dog.image.width), 
            dog.image.height
        );
    } else {
        ctx.drawImage(
            dog.image, 
            dog.x, 
            dog.y, 
            dog.image.width - mashtab(dog.image.width), 
            dog.image.height
        );

        ctx.drawImage(
            grass.image,
            grass.x,
            grass.y,
            grass.image.width - mashtab(grass.image.width),
            grass.image.height
        );
    }

    if (!start_game) {
        drawHeader(125 - mashtab(125));
    } else {
        drawTimeScrore(30);
        drawRound(30); 
        drawCartridges();
        drawDuckCount();
    }

    if (loss_game) {
        drawLoss(100);
        if (!dog.mockery_anim) {
            flashingText(`Please Click to restart`)
        }
    }

    requestId = requestAnimationFrame(update);
}

grass.image.onload = startAnimation;