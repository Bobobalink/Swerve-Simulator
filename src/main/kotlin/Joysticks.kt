import interfaces.JoysticksInterface
import java.awt.geom.Point2D

data class Joysticks(private val leftStick:Point2D.Double = Point2D.Double(0.0, 0.0), private val rightStick:Point2D.Double = Point2D.Double(0.0, 0.0)):
    JoysticksInterface {
    override fun getLeftStick(): Point2D.Double {
        return leftStick
    }

    override fun getRightStick(): Point2D.Double {
        return rightStick
    }
}
