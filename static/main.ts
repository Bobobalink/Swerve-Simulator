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
let gfx: Phaser.GameObjects.Graphics;

function preload() {
    this.load.image('grid', 'gridPattern.jpg');
}

function create(this) {
    this.add.image(0, 0, 'grid').setOrigin(0);
    gfx = this.add.graphics();
    sceneThing = this;
}

function getWebsocketUpdate(msg) {
    let robotState = JSON.parse(msg.data);

    drawRobot(gfx, robotState);
}

function update() {
    //
    if (this.input.gamepad.total === 0) {
        return;
    }
    let pad = this.input.gamepad.getPad(0);

    if (pad.axes.length) {
        joys = {
            leftStick: {x: pad.axes[0].getValue(), y: -1 * pad.axes[1].getValue()},
            rightStick: {x: pad.axes[2].getValue(), y: -1 * pad.axes[3].getValue()}
        };
    }
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
