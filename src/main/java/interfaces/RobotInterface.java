package interfaces;

import java.awt.geom.Point2D;
import java.util.List;

public interface RobotInterface {
    // holds a swerve wheel object for each of the wheels in the drivetrain
    public List<SwerveWheelInterface> getDrivetrain();

    // gets the absolute heading of the robot in *radians* (0 is pointing straight upwards)
    public double getHeading();

    // gets the position of the center of the robot compared to the origin of the world
    public Point2D.Double getPosition();
}
