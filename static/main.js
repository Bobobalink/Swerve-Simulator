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
var keyInput;
var gfx;
function preload() {
    this.load.image('grid', 'gridPattern.jpg');
}
function create() {
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
    var robotState = JSON.parse(msg.data);
    drawRobot(gfx, robotState);
}
function update() {
    var l_x = 0;
    var l_y = 0;
    var r_x = 0;
    var r_y = 0;
    if (this.input.gamepad.total === 0 || this.input.gamepad.getPad(0).axes.length == 0) { // no gamepad detected
        if (keyInput.L_up.isDown)
            l_y += 1;
        if (keyInput.L_down.isDown)
            l_y -= 1;
        if (keyInput.L_left.isDown)
            l_x -= 1;
        if (keyInput.L_right.isDown)
            l_x += 1;
        if (keyInput.R_up.isDown)
            r_y += 1;
        if (keyInput.R_down.isDown)
            r_y -= 1;
        if (keyInput.R_left.isDown)
            r_x -= 1;
        if (keyInput.R_right.isDown)
            r_x += 1;
        // do a short period lowpass filter to allow for analogish control
        l_x = l_x * JOY_FILTER_K + (1 - JOY_FILTER_K) * joys.leftStick.x;
        l_y = l_y * JOY_FILTER_K + (1 - JOY_FILTER_K) * joys.leftStick.y;
        r_x = r_x * JOY_FILTER_K + (1 - JOY_FILTER_K) * joys.rightStick.x;
        r_y = r_y * JOY_FILTER_K + (1 - JOY_FILTER_K) * joys.rightStick.y;
    }
    else { // gamepad detected
        var pad = this.input.gamepad.getPad(0);
        l_x = pad.axes[0].getValue();
        l_y = -1 * pad.axes[1].getValue();
        r_x = pad.axes[2].getValue();
        r_y = -1 * pad.axes[3].getValue();
        // special case for @Karaoke4272's weird bootleg PS2 gamepad
        if (r_y == 0)
            r_y = -1 * pad.axes[5].getValue();
    }
    joys = {
        leftStick: { x: l_x, y: l_y },
        rightStick: { x: r_x, y: r_y }
    };
    drawJoysticks(gfx, joys);
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
    request.onreadystatechange = function () { if (request.readyState === 4)
        robotBody = null; };
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
