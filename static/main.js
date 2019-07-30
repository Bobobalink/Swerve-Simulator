///<reference path="phaser.d.ts"/>
///<reference path="drawing.ts"/>
///<reference path="constants.js"/>
var websocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/robot");
websocket.onmessage = getWebsocketUpdate;
var joys = {
    leftStick: { x: 0.0, y: 0.0 },
    rightStick: { x: 0.0, y: 0.0 }
};
var config = {
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
var game = new Phaser.Game(config);
var sceneThing;
var gfx;
function preload() {
    this.load.image('grid', 'gridPattern.jpg');
}
function create() {
    this.add.image(0, 0, 'grid').setOrigin(0);
    gfx = this.add.graphics();
    sceneThing = this;
}
function getWebsocketUpdate(msg) {
    var robotState = JSON.parse(msg.data);
    drawRobot(gfx, robotState);
}
function update() {
    //
    if (this.input.gamepad.total === 0) {
        return;
    }
    var pad = this.input.gamepad.getPad(0);
    if (pad.axes.length) {
        joys = {
            leftStick: { x: pad.axes[0].getValue(), y: -1 * pad.axes[1].getValue() },
            rightStick: { x: pad.axes[2].getValue(), y: -1 * pad.axes[3].getValue() }
        };
    }
}
function resetRobot() {
    var req = new XMLHttpRequest();
    req.open("GET", "/reset", true);
    req.send();
}
function changeController() {
    var selector = document.getElementById("controllerPicker");
    var controller = selector.value;
    var request = new XMLHttpRequest();
    request.open('POST', '/changeController', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(controller);
}
function changeRobot() {
    var selector = document.getElementById("robotPicker");
    var robot = selector.value;
    var request = new XMLHttpRequest();
    robotBody = null;
    request.open('POST', '/changeRobot', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(robot);
}
setInterval(function () {
    websocket.send(JSON.stringify(joys));
}, 10);
// populate the list of robot controllers to choose from
var request = new XMLHttpRequest();
request.open('GET', '/controllers', true);
request.onload = function () {
    var data = JSON.parse(request.responseText);
    console.log(data);
    var controllers = data["controllers"];
    var picker = document.getElementById("controllerPicker");
    for (var _i = 0, controllers_1 = controllers; _i < controllers_1.length; _i++) {
        var controller = controllers_1[_i];
        var line = document.createElement("option");
        line.value = controller;
        line.innerText = controller;
        picker.appendChild(line);
    }
    for (var i = 0; i < picker.options.length; i++) {
        if (picker.options[i].value == data["activeController"])
            picker.options[i].selected = true;
    }
};
request.send();
// populate the list of robot controllers to choose from
var r2 = new XMLHttpRequest();
r2.open('GET', '/robots', true);
r2.onload = function () {
    var data = JSON.parse(r2.responseText);
    console.log(data);
    var picker = document.getElementById("robotPicker");
    for (var _i = 0, _a = data["robots"]; _i < _a.length; _i++) {
        var robot = _a[_i];
        var line = document.createElement("option");
        line.value = robot;
        line.innerText = robot;
        picker.appendChild(line);
    }
    for (var i = 0; i < picker.options.length; i++) {
        if (picker.options[i].value == data["activeRobot"])
            picker.options[i].selected = true;
    }
};
r2.send();
