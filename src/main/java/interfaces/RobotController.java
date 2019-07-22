package interfaces;

public interface RobotController {
    // runs every 20ms, just like real robot code
    public void loop(JoysticksInterface joysticks, RobotInterface robot);
}
