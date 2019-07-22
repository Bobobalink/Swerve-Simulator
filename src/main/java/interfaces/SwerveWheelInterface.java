package interfaces;

import java.awt.geom.Point2D;

public interface SwerveWheelInterface {
    // gets the angle of the wheel in radians compared to the front of the robot
    public double getWheelAngle();

    // gets the wheel velocity (in m/s)
    public double getWheelVelocity();

    // sets the wheel angle in randians compared to the front of the robot
    // (0, pi) is steering to the left, (-pi, 0) is steering right
    public void setWheelAngle(double angle);

    // sets the wheel velocity (in m/s)
    // negative values will go backwards
    public void setWheelVelocity(double speed);

    // gets the position of the wheel compared to the center of the robot frame in meters
    // positive values are forward and to the right of the robot frame
    public Point2D.Double getWheelPosition();
}
