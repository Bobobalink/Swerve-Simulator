///<reference path="phaser.d.ts"/>
///<reference path="drawing.ts"/>
///<reference path="constants.js"/>

let websocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/robot");

websocket.onmessage = getWebsocketUpdate;
let joys = {
    leftStick: {x: 0.0, y: 0.0},
    rightStick: {x: 0.0, y: 0.0}
};

let config = {
    type: Phaser.AUTO,
    parent: 'WorldArea',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    input: {
        gamepad: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let sceneThing;
let keyInput;
let gfx: Phaser.GameObjects.Graphics;

function preload() {
    this.load.image('grid', 'gridPattern.jpg');
}

function create(this) {
    this.add.image(0, 0, 'grid').setOrigin(0);
    gfx = this.add.graphics();
    sceneThing = this;
    keyInput = this.input.keyboard.addKeys({
        'L_up': Phaser.Input.Keyboard.KeyCodes.W,
        'L_down': Phaser.Input.Keyboard.KeyCodes.S,
        'L_left': Phaser.Input.Keyboard.KeyCodes.A,
        'L_right': Phaser.Input.Keyboard.KeyCodes.D,
        'R_up': Phaser.Input.Keyboard.KeyCodes.I,
        'R_down': Phaser.Input.Keyboard.KeyCodes.K,
        'R_left': Phaser.Input.Keyboard.KeyCodes.J,
        'R_right': Phaser.Input.Keyboard.KeyCodes.L
    });

}

function getWebsocketUpdate(msg) {
    let robotState = JSON.parse(msg.data);

    drawRobot(gfx, robotState);
}

function update() {
    let l_x = 0;
    let l_y = 0;
    let r_x = 0;
    let r_y = 0;
    if (this.input.gamepad.total === 0 || this.input.gamepad.getPad(0).axes.length == 0) { // no gamepad detected
        if(keyInput.L_up.isDown)
            l_y += 1;
        if(keyInput.L_down.isDown)
            l_y -= 1;
        if(keyInput.L_left.isDown)
            l_x -= 1;
        if(keyInput.L_right.isDown)
            l_x += 1;
        if(keyInput.R_up.isDown)
            r_y += 1;
        if(keyInput.R_down.isDown)
            r_y -= 1;
        if(keyInput.R_left.isDown)
            r_x -= 1;
        if(keyInput.R_right.isDown)
            r_x += 1;

        // do a short period lowpass filter to allow for analogish control
        l_x = l_x * JOY_FILTER_K + (1 - JOY_FILTER_K) * joys.leftStick.x;
        l_y = l_y * JOY_FILTER_K + (1 - JOY_FILTER_K) * joys.leftStick.y;
        r_x = r_x * JOY_FILTER_K + (1 - JOY_FILTER_K) * joys.rightStick.x;
        r_y = r_y * JOY_FILTER_K + (1 - JOY_FILTER_K) * joys.rightStick.y;

    } else { // gamepad detected
        let pad = this.input.gamepad.getPad(0);

        l_x = pad.axes[0].getValue();
        l_y = -1 * pad.axes[1].getValue();
        r_x = pad.axes[2].getValue();
        r_y = -1 * pad.axes[3].getValue();

        // special case for @Karaoke4272's weird bootleg PS2 gamepad
        if(r_y == 0)
            r_y = -1 * pad.axes[5].getValue();
    }

    joys = {
        leftStick: {x: l_x, y: l_y},
        rightStick: {x: r_x, y: r_y}
    };

    drawJoysticks(gfx, joys);
}

function resetRobot() {
    let req = new XMLHttpRequest();
    req.open("GET", "/reset", true);
    req.send();
}

function changeController() {
    let selector = document.getElementById("controllerPicker") as HTMLSelectElement;
    let controller = selector.value;
    let request = new XMLHttpRequest();
    request.open('POST', '/changeController', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(controller);

}

function changeRobot() {
    let selector = document.getElementById("robotPicker") as HTMLSelectElement;
    let robot = selector.value;
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {if (request.readyState === 4) robotBody = null};

    request.open('POST', '/changeRobot', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(robot);
}

setInterval(() => {
    websocket.send(JSON.stringify(joys));
}, 10);


// populate the list of robot controllers to choose from
let request = new XMLHttpRequest();
request.open('GET', '/controllers', true);

request.onload = function() {
    let data = JSON.parse(request.responseText);
    console.log(data);
    let controllers = data["controllers"];
    let picker = document.getElementById("controllerPicker") as HTMLSelectElement;
    for(let controller of controllers) {
        let line = document.createElement("option");
        line.value = controller;
        line.innerText = controller;
        picker.appendChild(line);
    }

    for(let i = 0; i < picker.options.length; i++) {
        if(picker.options[i].value == data["activeController"])
            picker.options[i].selected = true;
    }
};

request.send();

// populate the list of robot controllers to choose from
let r2 = new XMLHttpRequest();
r2.open('GET', '/robots', true);

r2.onload = function() {
    let data = JSON.parse(r2.responseText);
    console.log(data);
    let picker = document.getElementById("robotPicker") as HTMLSelectElement;
    for(let robot of data["robots"]) {
        let line = document.createElement("option");
        line.value = robot;
        line.innerText = robot;
        picker.appendChild(line);
    }

    for(let i = 0; i < picker.options.length; i++) {
        if(picker.options[i].value == data["activeRobot"])
            picker.options[i].selected = true;
    }
};

r2.send();
