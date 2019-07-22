import interfaces.RobotInterface
import interfaces.SwerveWheelInterface
import java.awt.geom.Point2D
import java.util.*

class Robot constructor(private val driveTrain: List<SwerveWheel>): RobotInterface {
    private var position = Point2D.Double(0.0, 0.0)
    private var heading = 0.0
    var drivenWell = true

    override fun getHeading(): Double {
        return heading
    }

    fun setHeading(a: Double) {
        heading = a
    }

    override fun getPosition(): Point2D.Double {
        return position.copy()
    }

    fun setPosition(a: Point2D.Double) {
        position = a.copy()
    }

    override fun getDrivetrain(): MutableList<SwerveWheelInterface> {
        return Collections.unmodifiableList(driveTrain)
    }

    // output velocity is average of all the independent wheel velocities
    val linearVelocity: Point2D.Double
        get(): Point2D.Double {
            var vel = Point2D.Double(0.0, 0.0)
            for (wheel in driveTrain) {
                vel += wheel.appliedVel
            }

            vel /= driveTrain.size.toDouble()

            // transform from local-to-robot orientation to world orientation
            vel = vel.rotate(heading)
            return vel
        }

    // output angular velocity is the average of all the independent wheel angular velocities
    val angularVelocity: Double
        get(): Double {
            var omega = 0.0
            for (wheel in driveTrain) {
                omega += wheel.appliedRotation
            }
            return omega / driveTrain.size
        }

    // updates the position and heading of the robot based on the current velocities and the time since the last update
    fun update(timeSince: Double) {
        position += linearVelocity * timeSince
        heading += angularVelocity * timeSince

        drivenWell = true
        for(wheel in driveTrain) {
            drivenWell = drivenWell and wheel.checkWheelSlip(linearVelocity.rotate(-1 * heading), angularVelocity)
        }
    }
}
