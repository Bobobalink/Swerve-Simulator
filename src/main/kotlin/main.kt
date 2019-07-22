import interfaces.RobotController
import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import java.awt.geom.Point2D
import kotlin.concurrent.thread

fun main() {
    val canr = ControllersAndRobots()

    // rather gross and unfortunate way to get the first robot controller in the list
    var controller: RobotController? = canr.controllers.iterator().next().value
    var controllerName: String? = canr.controllers.iterator().next().key

    var robot: Robot? = canr.robots.iterator().next().value
    var robotName: String? = canr.robots.iterator().next().key

    var joys = Joysticks(Point2D.Double(0.0, 0.0))

    var robotUpdateThread: Thread? = null

    val app: Javalin = Javalin.create { config ->
        config.addStaticFiles("static/", Location.EXTERNAL)
    }

    app.get("/") { ctx -> ctx.redirect("/index.html") }

    app.ws("/robot") { ws ->
        ws.onConnect { ctx ->
            var lastCall = System.currentTimeMillis()
            robotUpdateThread = thread(start=true) {
                while (true) {
                    while (System.currentTimeMillis() - lastCall < 20.0)
                        Thread.sleep(1)

                    controller?.loop(joys, robot)
                    val timeTaken = (System.currentTimeMillis() - lastCall) / 1000.0
                    robot?.update(timeTaken)
                    lastCall = System.currentTimeMillis()
                    if(robot != null)
                        ctx.send(robot!!)
                }
            }
        }

        ws.onMessage { ctx ->
            joys = ctx.message<Joysticks>()
        }

        ws.onClose { ctx ->
            robotUpdateThread?.interrupt()
            robotUpdateThread = null

        }
    }

    app.get("/reset") { ctx ->
        robot?.heading = 0.0
        robot?.position = Point2D.Double(0.0, 0.0)
    }

    app.get("/controllers") { ctx ->
        ctx.json(mapOf(
            "controllers" to canr.controllers.keys,
            "activeController" to controllerName
        ))
    }

    app.get("/robots") { ctx ->
        ctx.json(mapOf(
            "robots" to canr.robots.keys,
            "activeRobot" to robotName
        ))

    }

    app.post("/changeController") { ctx ->
        println(ctx.body())
        try {
            controller = canr.controllers[ctx.body()]
            controllerName = ctx.body()
        } catch (e: NoSuchElementException) {
            ctx.status(404)
            println("controller not found!")
        }
    }

    app.post("/changeRobot") { ctx ->
        println(ctx.body())
        try {
            robot = canr.robots[ctx.body()]
            robotName = ctx.body()
        } catch (e: NoSuchElementException) {
            ctx.status(404)
            println("robot not found!")
        }
    }

    app.start(7000)
}
