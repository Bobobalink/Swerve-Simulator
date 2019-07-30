///<reference path="phaser.d.ts"/>
///<reference path="main.ts"/>
///<reference path="constants.js"/>

import Geom = Phaser.Geom;

let robotBody: Geom.Polygon = null;
let modRect = new Geom.Rectangle(-0.07, -0.07, 0.14, 0.14);
let moduleBody = rectToPointyPoly(modRect);

function drawRobot(graphics: Phaser.GameObjects.Graphics, robotState) {
    if (graphics == null || robotState == null || robotState.position == null)
        return;
    if (robotBody == null) {
        let rect = new Geom.Rectangle(-0.005, -0.005, 0.01, 0.01);
        // get the bounding box of center of each wheel
        for (let i = 0; i < robotState.drivetrain.length; i++) {
            let wheelPos = robotState.drivetrain[i].position;
            Geom.Rectangle.MergeXY(rect, wheelPos.x, wheelPos.y);
        }
        // expand the bounding box
        Geom.Rectangle.Inflate(rect, 0.15, 0.15);

        robotBody = rectToPointyPoly(rect);
    }

    graphics.clear();

    drawSwerveModules(graphics, robotState);

    drawBody(graphics, robotState);

    drawAppliedVelocities(graphics, robotState);

    drawVelocities(graphics, robotState);
}

function drawVelocities(graphics, robotState) {
    graphics.lineStyle(2, 0xffff00);
    graphics.fillStyle(0xffff00);

    if (mag(robotState.linearVelocity) > 0.01) {
        drawVector(graphics, pointToPixels(robotState.position), velocityToPixels(robotState.linearVelocity));
    }

    for (let i = 0; i < robotState.drivetrain.length; i++) {
        if (mag(robotState.drivetrain[i].velocityAtWheel) > 0.01) {
            let wheelPos = robotState.drivetrain[i].position;
            wheelPos = rotatePoint(wheelPos, robotState.heading);
            translatePoint(wheelPos, robotState.position);

            let wheelVel = robotState.drivetrain[i].velocityAtWheel;
            wheelVel = rotatePoint(wheelVel, robotState.heading);

            drawVector(graphics, pointToPixels(wheelPos), velocityToPixels(wheelVel));
        }
    }
}

function drawAppliedVelocities(graphics, robotState) {
    graphics.lineStyle(2, 0xff00ff);
    graphics.fillStyle(0xff00ff);
    for (let i = 0; i < robotState.drivetrain.length; i++) {
        if (mag(robotState.drivetrain[i].appliedVel) > 0.01) {
            let wheelPos = robotState.drivetrain[i].position;
            wheelPos = rotatePoint(wheelPos, robotState.heading);
            translatePoint(wheelPos, robotState.position);

            let wheelVel = robotState.drivetrain[i].appliedVel;
            wheelVel = rotatePoint(wheelVel, robotState.heading);

            drawVector(graphics, pointToPixels(wheelPos), velocityToPixels(wheelVel));
        }
    }
}

function drawSwerveModules(graphics: Phaser.GameObjects.Graphics, robotState) {
    // draw each swerve module by copying the prototype body and transforming it
    for (let mod of robotState.drivetrain) {
        let lmb = Geom.Polygon.Clone(moduleBody);

        // relative to the robot
        rotatePoly(lmb, -1 * mod.wheelAngle);
        translatePoly(lmb, mod.position);

        //now move it to where the robot is
        rotatePoly(lmb, robotState.heading);
        translatePoly(lmb, robotState.position);

        polyToPixels(lmb);

        graphics.lineStyle(2, 0x000000);

        if (mag(mod.wheelSlip) < 0.1) {
            graphics.fillStyle(0x00ff00, 1.0);
        } else {
            graphics.fillStyle(0xff0000, 1.0);
        }

        graphics.fillPoints(lmb.points, true);
        graphics.strokePoints(lmb.points, true);

        let centerPoint = mod.position;
        centerPoint = rotatePoint(centerPoint, robotState.heading);
        translatePoint(centerPoint, robotState.position);
        centerPoint = pointToPixels(centerPoint);
        graphics.fillStyle(0x0088ff);
        graphics.fillCircle(centerPoint.x, centerPoint.y, 3);
    }
}

function drawBody(graphics: Phaser.GameObjects.Graphics, robotState) {
    // draw the robot body on top of the swerve modules
    let lrb = Geom.Polygon.Clone(robotBody);
    rotatePoly(lrb, robotState.heading);
    translatePoly(lrb, robotState.position);

    polyToPixels(lrb);

    // the body will be green if it's driven well, red if the wheels are dragging
    if (robotState.drivenWell)
        graphics.fillStyle(0x00ff00, 0.33);
    else
        graphics.fillStyle(0xff0000, 0.33);

    graphics.fillPoints(lrb.points, true);

    graphics.lineStyle(2, 0x000000);
    graphics.strokePoints(lrb.points, true);

    let centerPoint = pointToPixels(robotState.position);
    graphics.fillStyle(0x0088ff);
    graphics.fillCircle(centerPoint.x, centerPoint.y, 5);
}

function pointToPixels(loc) {
    return new Geom.Point(POSITION_SCALE_FACTOR * loc.x + SCREEN_WIDTH / 2, -1 * POSITION_SCALE_FACTOR * loc.y + SCREEN_HEIGHT / 2);
}

function polyToPixels(poly: Geom.Polygon) {
    for (let i in poly.points) {
        poly.points[i] = pointToPixels(poly.points[i]);
    }
}

function velocityToPixels(vel) {
    return new Geom.Point(VELOCITY_SCALE_FACTOR * vel.x, -1 * VELOCITY_SCALE_FACTOR * vel.y);
}

// rotates a point around the origin
function rotatePoint(point, angle) {
    return new Geom.Point(Math.cos(angle) * point.x - Math.sin(angle) * point.y, Math.cos(angle) * point.y + Math.sin(angle) * point.x);
}

// rotates a polygon around the origin
function rotatePoly(poly: Geom.Polygon, angle) {
    for (let i in poly.points) {
        poly.points[i] = rotatePoint(poly.points[i], angle);
    }
}

function translatePoly(poly: Geom.Polygon, pos) {
    for (let i in poly.points) {
        poly.points[i].x += pos.x;
        poly.points[i].y += pos.y;
    }
}

function rectToPoly(rect: Geom.Rectangle): Geom.Polygon {
    let pts: Array<Geom.Point> = [];
    pts.push(new Geom.Point(rect.left, rect.top));
    pts.push(new Geom.Point(rect.right, rect.top));
    pts.push(new Geom.Point(rect.right, rect.bottom));
    pts.push(new Geom.Point(rect.left, rect.bottom));

    return new Geom.Polygon(pts);
}

// returns a "house" pentagon, with the 'bottom' face split and made pointy to show orientation
function rectToPointyPoly(rect: Geom.Rectangle): Geom.Polygon {
    let pts: Array<Geom.Point> = [];
    pts.push(new Geom.Point(rect.left, rect.top));
    pts.push(new Geom.Point(rect.right, rect.top));
    pts.push(new Geom.Point(rect.right, rect.bottom));
    pts.push(new Geom.Point((rect.left + rect.right) / 2, rect.bottom + rect.height * 0.2));
    pts.push(new Geom.Point(rect.left, rect.bottom));

    return new Geom.Polygon(pts);
}

function translatePoint(p1, p2) {
    p1.x += p2.x;
    p1.y += p2.y;
}

function mag(point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
}

function unit(point) {
    let pmag = mag(point);
    return new Geom.Point(point.x / pmag, point.y / pmag);
}

function drawVector(graphics: Phaser.GameObjects.Graphics, point, vec) {
    let tip = new Geom.Point(point.x + vec.x, point.y + vec.y);
    let head = new Geom.Triangle(-5, 0, 5, 0, 0, 7);
    // rotate the head to the right angle
    let angle = Math.atan2(vec.y, vec.x) - Math.PI / 2;
    Geom.Triangle.RotateAroundXY(head, 0, 0, angle);
    //translate the head to the tip
    Geom.Triangle.Offset(head, tip.x, tip.y);
    //draw the line of the vector (set the color before calling the function)
    graphics.lineBetween(point.x, point.y, tip.x, tip.y);
    graphics.fillTriangleShape(head);
}
