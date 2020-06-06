import interfaces.SwerveWheelInterface
import java.awt.geom.Point2D
import java.lang.Double.isFinite
import java.lang.Double.isNaN
import kotlin.math.*

class SwerveWheel(private val location: Point2D.Double) : SwerveWheelInterface {
    private var wheelAngle = 0.0
    private var wheelVelocity = 0.0

    var wheelSlip: Point2D.Double = Point2D.Double(0.0, 0.0)
    var velocityAtWheel: Point2D.Double = Point2D.Double(0.0, 0.0)

    constructor(x: Double, y: Double) : this(Point2D.Double(x, y))

    override fun getWheelAngle(): Double {
        return wheelAngle
    }

    override fun getWheelVelocity(): Double {
        return wheelVelocity
    }

    override fun setWheelAngle(angle: Double) {
        if(isNaN(angle)) {
            throw IllegalArgumentException("Attempted to set wheel angle to NaN!")
        } else if(!isFinite(angle)) {
            throw IllegalArgumentException("Attempted to set wheel angle to Infinity! (Check for division by zero)")
        }
        wheelAngle = (angle + PI) % (2 * PI) - PI
    }

    override fun setWheelVelocity(speed: Double) {
        if(isNaN(speed))
        {
            throw IllegalArgumentException("Attempted to set wheel velocity to NaN!")
        } else if(!isFinite(speed)) {
            throw IllegalArgumentException("Attempted to set wheel velocity to Infinity! (Check for division by zero)")
        }
        wheelVelocity = speed
    }

    override fun getPosition(): Point2D.Double {
        return location.copy()
    }

    // all of these things are properties so that the json serialization gets all these lovely numbers to work with

    val appliedVel: Point2D.Double
        get() {
            // 0 angle is up (y): add pi / 2 from the angle to get back to normal land
            return Point2D.Double(cos(wheelAngle + PI / 2) * wheelVelocity, sin(wheelAngle + PI / 2) * wheelVelocity)
        }

    // gets the rotational velocity of the frame set by this wheel
    val appliedRotation: Double
        get() {
            // get the portion of the applied velocity tangential to the circle, divide by the radius
            return appliedVel.dot(location.unit().getPerpVector()) / (location.mag())
        }

    // calculates the amount of wheel slip and returns True if there is almost no wheel slip (the swerve drive is being driven well
    fun checkWheelSlip(linearVel: Point2D.Double, angularVel: Double): Boolean {
        velocityAtWheel = linearVel + angularVel * location.getPerpVector()

        wheelSlip = velocityAtWheel - appliedVel

        return abs(wheelSlip.mag()) < 0.1

    }
}
