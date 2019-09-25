Swerve Simulator
===============

Welcome to Swerve Simulator, the most advanced*, accurate**, and highly developed*** simulation of the gold standard of FRC drivetrain systems

This project was designed to help teach the high-level basics of programming a swerve drive.  
It does not attempt to simulate any of the dynamics of the system, and assumes a magical robot with no inertia and swerve modules that can instantly point in any direction and drive at any velocity instantly.  
The goal for the students using this code is to write new `interfaces.RobotController` implementations that complete various common swerve drive tasks.
I will be putting tasks in the `tasks/` directory with the goal of building up to a fully holonomic swerve drive system with field oriented control (and maybe other things depending on how fast this goes)  

Setup
-----
- Download and install the Git command line from [here](https://git-scm.com/downloads). Unless you know what you're doing, don't use VIM as the editor.
  I would suggest using Notepad++, if you don't already have it installed then it's totally worth getting
- If you don't already have one, make a Github account on the website you're reading this from. 
- Make a new repository by clicking the + in the top right corner of the page. Don't include a readme, gitignore, or license file since these are all included in my repository.
- On the repository page, copy the URL under the "Quick Setup" box
- Open up the GIT Bash on your computer. Type `cd My\ Documents/` then press enter. Next, run `git clone <copied url>` (right click to paste) to get the repository on your computer
- `cd <folder>` into the folder you just made (it says `cloning into <folder>` in the last command).
- Now for the fun git stuff: we're going to create a link between your new repository and my master repository.
  + `git remote add problems https://github.com/Bobobalink/Swerve-Simulator.git`
  + `git pull problems master`
  + `git push`
- You should now have all of the files from this repository in the folder you just created, and your own git repository that you can push your solutions to
- What we've created is a slightly non-trivial git setup using two different "upstream" repositories. This allows several things:
  + Just like any git repository, you can sync your local changes with the remote github repo:
    + `git add .` adds the changes you've made to the list of things to commit (`.` is the current directory, change this to only commit some changes)
    + `git commit` creates a git *commit*, which is a list of changes to the repository. It will ask you for a *commit message*.
      Commit messages are short-ish descriptions of what changes are in the commit. It serves as a log of what you've done,
      and allows you to quickly find a commit you're looking for if you're trying to track down an old change you made.
    + `git push` syncs all of the commits you have made to *your* github repository. Until you do this, all of your changes are only stored on your own computer.
    + `git pull` takes all of the commits on *your* github repository and copies them to your computer, *merging* all of their changes into your code
  + Additionally, you can easily get any changes that have been made on this repository (e.g. new tasks, updated simulation, etc.)
    + `git pull problems master`
  + When you pull (from your git repository or from this repository), it will fail unless all of your local changes have been commited
    + Check this by running `git status`, make sure it says "working directory clean"


- Now we can set up the development environment and finally run the code!
- Download and install the newest version of the Java Development Kit (JDK) from [here](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
  This was developed for Java 12 but it should work fine with newer versions
- Download and install Intellij IDEA Community edition from [here](https://www.jetbrains.com/idea/download). This is a fully featured Java and Kotlin IDE made by Jetbrains (conveniently the creator of Kotlin).  
  At some point I'll figure out how to put this stuff in VS Code, but until then just use IDEA, it's free and very good.
- After it's setup, press "import project" and choose `build.gradle.kts` in the folder of the git repository you just created. Click finish and wait for the bottom right hand corner of the screen to stop saying things are running
- Open `src/main/kotlin/main.kt` and press the green arrow next to the line saying `fun main() {` (or press `ctrl+shift+f10`)
- Click the link in the console output (http://localhost:7000) to go to the webpage. Press some buttons on your controller to wake it up, and you should be able to drive the robot.
- If it isn't working, close IDEA and delete the folder containing the git repository, then follow the instructions again.

How to use the Simulation
-----------------
- Start the simulation by navigating to `main/kotlin/main.kt` and press `ctrl+shift+f10`. This will create a "run configuration", visible in the top left corner of the scren
- After this, to run it again you can just press `shift+f10` from any file, or press the start button at the top right corner of the screen
- The robot is drawn according to the scale factors found in `static/constants.js`. Change these if it doesn't show up well on your screen
- The robot body is green if there is no wheel slippage, and red if any wheel is trying to drive in a direction or speed
  that is not the same as the direction and speed it should be going according to the motion of the robot body
- Each swerve module will also be drawn as red or green according to the same logic
- The bluish arrows are the velocities that each swerve wheel is driven to go. If it's swerving properly, these arrows will perfectly match the yellow arrows, making them invisible.
- The yellow arrows at each swerve module and the center of rotation of the robot body is the velocity each piece is actually going, relative to the floor.
- Use the Robot Controller and Robot Layout dropdowns to choose different robot controllers and bodies to use.
  Selecting a new one will immediately change the simulation to using that setup.
- The reset button will put the robot back at the origin and pointing directly up.

Now that everything is setup, go to the `tasks/` folder and start coding! Read `0. General Instructions` and then move on to the first task. 

Code locations:
---------------
- in `src/main/java` you will find Java interfaces that `interfaces.RobotController` will interact with. All controllers implement `interfaces.RobotController` and are passed instances of `interfaces.JoysticksInterface` and `interfaces.RobotInterface` which are used to control the robot.  
- `src/main/kotlin` contains the code for the robot simulation. Students are not expected to look at any of this code.
- `static/` contains all of the frontend code for displaying the robot on the web page. Also not necessary/expected to look at this code

------------------------------------------------------------------------------------------------------------------------
\* totalling almost five *hundred* lines of code!
   That's almost as much code as the Cheezy Poofs used to control one of the joints of their 2018 robot's arm! ([source](https://github.com/Team254/FRC-2018-Public/blob/master/src/main/java/com/team254/frc2018/subsystems/Wrist.java))

** based on a wholly incomplete and arguably incompetent model of robot dynamics that could only come from someone with an impressive disdain for mechanical engineering

*** developed over about a week of one college student's lazy coding while playing with Kotlin for the first time ever
