import java.awt.geom.Point2D
import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

operator fun Point2D.Double.plus(b: Point2D.Double): Point2D.Double {
    return Point2D.Double(this.x + b.x, this.y + b.y)
}

operator fun Point2D.Double.minus(b: Point2D.Double): Point2D.Double {
    return Point2D.Double(this.x - b.x, this.y - b.y)
}

operator fun Point2D.Double.times(c: Double): Point2D.Double {
    return Point2D.Double(c * this.x, c * this.y)
}

operator fun Double.times(b: Point2D.Double): Point2D.Double {
    return b * this
}

operator fun Point2D.Double.div(c: Double): Point2D.Double {
    return Point2D.Double(this.x / c, this.y / c)
}

fun Point2D.Double.dot(b: Point2D.Double): Double {
    return this.x * b.x + this.y * b.y
}

fun Point2D.Double.mag(): Double {
    return sqrt(this.x.pow(2) + this.y.pow(2))
}

fun Point2D.Double.unit(): Point2D.Double {
    return this / this.mag()
}

fun Point2D.Double.getPerpVector(): Point2D.Double {
    return Point2D.Double(-1 * this.y, this.x)
}

fun Point2D.Double.copy(): Point2D.Double {
    return Point2D.Double(this.x, this.y)
}

fun Point2D.Double.rotate(angle: Double): Point2D.Double {
    return Point2D.Double(this.x * cos(angle) - this.y * sin(angle), this.x * sin(angle) + this.y * cos(angle))
}
