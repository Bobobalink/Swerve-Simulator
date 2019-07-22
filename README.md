Swerve Simulator
===============

Welcome to Swerve Simulator, the most advanced[^1], accurate[^2], and highly developed[^3] simulation of the gold standard of FRC drivetrain systems

This project was designed to help teach the high-level basics of programming a swerve drive.  
It does not attempt to simulate any of the dynamics of the system, and assumes a magical robot with no inertia and swerve modules that can instantly point in any direction and drive at any velocity instantly.  
The goal for the students using this code is to write new `interfaces.RobotController` implementations that complete various common swerve drive tasks.
I will be putting tasks in the `tasks/` directory with the goal of building up to a fully holonomic swerve drive system with field oriented control (and maybe other things depending on how fast this goes)  

Setup
-----
- Download and install Intellij IDEA Community edition from [here](https://www.jetbrains.com/idea/download). This is a fully featured Java and Kotlin IDE made by Jetbrains (conveniently the creator of Kotlin).  
  At some point I'll figure out how to put this stuff in VS Code, but until then just use IDEA.
- Download and install the Git command line from [here](https://git-scm.com/downloads). Unless you know what you're doing, don't use VIM as the editor.
  I would suggest using Notepad++, if you don't already have it installed then it's totally worth getting
- If you don't already have one, make a Github account on the website you're reading this from. Make a new repository by
  clicking the + in the top right corner of the page. Don't include a readme, gitignore, or license file since these are all included in my repository.
  Once it's created, click the "Clone or Download" button and copy the url it gives you.
- Open up the GIT Bash on your computer. Type `cd My\ Documents/` then press enter. Next, run `git clone <copied url>` (right click to paste) to get the repository on your computer
- `cd <folder>` into the folder you just made (it says `cloning into <folder>` in the last command).
- Now for the fun git stuff: 

Code locations:
---------------
- in `src/main/java` you will find Java interfaces that `interfaces.RobotController` will interact with. All controllers implement `interfaces.RobotController` and are passed instances of `interfaces.JoysticksInterface` and `interfaces.RobotInterface` which are used to control the robot.  
- `src/main/kotlin` contains the code for the robot simulation. Students are not expected to look at any of this code and it is a bit messy right now.  
- `static/` contains all of the frontend code for displaying the robot on the web page. Also not necessary/expected to look at this code

------------------------------------------------------------------------------------------------------------------------
[^1]: totalling almost five *hundred* lines of code!
      That's almost as much code as the Cheezy Poofs used to control one of the joints of their 2018 robot's arm! ([source](https://github.com/Team254/FRC-2018-Public/blob/master/src/main/java/com/team254/frc2018/subsystems/Wrist.java))

[^2]: based on a wholly incomplete and arguably incompetent model of robot dynamics that could only come from someone with an impressive disdain for mechanical engineering

[^3]: developed over about a week of one college student's lazy coding while playing with Kotlin for the first time ever
