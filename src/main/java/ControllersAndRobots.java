import RobotControllers.ArcadeDrive;
import RobotControllers.TankDrive;
import interfaces.RobotController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;

public class ControllersAndRobots {
    public LinkedHashMap<String, Robot> robots = new LinkedHashMap<>();
    public LinkedHashMap<String, RobotController> controllers = new LinkedHashMap<>();

    public ControllersAndRobots() {
        // this mouthful of weird looking method calls creates a list of swerve modules that make up the robot body
        // just add more of these chunks with different coordinates to add new robot options
        // the very first entry is the default entry
        robots.put("Square", new Robot(new ArrayList<>(Arrays.asList(
                new SwerveWheel(0.5, 0.5),
                new SwerveWheel(-0.5, 0.5),
                new SwerveWheel(0.5, -0.5),
                new SwerveWheel(-0.5, -0.5)
        ))));

        robots.put("Two Wheeler", new Robot(new ArrayList<>(Arrays.asList(
                new SwerveWheel(0.5, 0.0), new SwerveWheel(-0.5, 0.0)
        ))));

        robots.put("Square Six", new Robot(new ArrayList<>(Arrays.asList(
                new SwerveWheel(0.5, 0.5), new SwerveWheel(-0.5, 0.5),
                new SwerveWheel(0.5, -0.5), new SwerveWheel(-0.5, -0.5),
                new SwerveWheel(0.5, 0.0), new SwerveWheel(-0.5, 0.0)
        ))));

        robots.put("Outriggers", new Robot(new ArrayList<>(Arrays.asList(
                new SwerveWheel(0.5, 0.5), new SwerveWheel(-0.5, 0.5),
                new SwerveWheel(0.5, -0.5), new SwerveWheel(-0.5, -0.5),
                new SwerveWheel(0.75, 0.0), new SwerveWheel(-0.75, 0.0)
        ))));

        robots.put("Double Two Wheeler", new Robot(new ArrayList<>(Arrays.asList(
                new SwerveWheel(0.5, 0.0), new SwerveWheel(-0.5, 0.0),
                new SwerveWheel(0.75, 0.0), new SwerveWheel(-0.75, 0.0)
        ))));

        // through the magic of my bad simulation, this simulates a robot with one powered wheel in front and a free moving back
        robots.put("Motorcycle", new Robot(new ArrayList<>(Arrays.asList(
                new SwerveWheel(0.0, 0.5)
        ))));

        // this is the same logic as Motorcycle, but this time simulating a front wheel drive car
        robots.put("Car", new Robot(new ArrayList<>(Arrays.asList(
                new SwerveWheel(0.5, 0.5),
                new SwerveWheel(-0.5, 0.5)
        ))));

        // here is where you put new controllers to test
        // again, the top entry is the one that's enabled by default
        controllers.put("Tank Drive", new TankDrive());
        controllers.put("Arcade Drive", new ArcadeDrive());
    }
}
