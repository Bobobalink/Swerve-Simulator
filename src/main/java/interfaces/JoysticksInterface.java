package interfaces;

import java.awt.geom.Point2D;

public interface JoysticksInterface {
    // gets the cartesian coordinates of the left joystick (x and y)
    public Point2D.Double getLeftStick();

    // gets the cartesian coordinates of the right joystick (x and y)
    public Point2D.Double getRightStick();
}
