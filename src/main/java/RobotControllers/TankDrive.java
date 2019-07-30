package RobotControllers;

import interfaces.JoysticksInterface;
import interfaces.RobotController;
import interfaces.RobotInterface;
import interfaces.SwerveWheelInterface;

public class TankDrive implements RobotController {
    @Override
    public void loop(JoysticksInterface joysticks, RobotInterface robot) {
        double leftPower = joysticks.getLeftStick().y * 5.0;
        double rightPower = joysticks.getRightStick().y * 5.0;

        // assist to allow driving exactly straight
        if(Math.abs(leftPower - rightPower) < 0.5) {
            leftPower = rightPower;
        }

        for(SwerveWheelInterface wheel : robot.getDrivetrain()) {
            // make sure the wheels are always facing forward (none of this funny swerve business)
            wheel.setWheelAngle(0);

            // if the wheel is on the right side of the robot
            if(wheel.getPosition().x > 0) {
                wheel.setWheelVelocity(rightPower);
            } else {
                wheel.setWheelVelocity(leftPower);
            }
        }
    }
}
