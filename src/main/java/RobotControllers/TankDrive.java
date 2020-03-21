package RobotControllers;

import java.util.List;

import interfaces.JoysticksInterface;
import interfaces.RobotController;
import interfaces.RobotInterface;
import interfaces.SwerveWheelInterface;

public class TankDrive implements RobotController {
    @Override // this tells Java that the `loop` method implements the `loop` method specified in `RobotController`
    public void loop(JoysticksInterface joysticks, RobotInterface robot) {
        double leftVelocity = joysticks.getLeftStick().y * 5.0; // get the velocity of the left half of the robot
        double rightVelocity = joysticks.getRightStick().y * 5.0; // get the velocity of the right half of the robot

        // this is a list of the swerve modules that are on the robot
        List<SwerveWheelInterface> drivetrain = robot.getDrivetrain();

        for(int i = 0; i < drivetrain.size(); i++) { // loop through each swerve module
            SwerveWheelInterface wheel = drivetrain.get(i); // the swerve module we are looking at

            wheel.setWheelAngle(0); // make sure the wheels are always facing forward (none of this funny swerve business)

            // use the x position of the wheel (with the center of the robot being (0, 0)) to see if the wheel is on the right half of the robot or the left half
            if(wheel.getPosition().x > 0) { // positive x is to the right, negative x is to the left
                wheel.setWheelVelocity(rightVelocity); // wheels on the right go at our calculated right velocity
            } else {
                wheel.setWheelVelocity(leftVelocity); // wheels on the left go at our calculated left velocity
            }
        }
    }
}
