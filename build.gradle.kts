import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.3.21"
}

group = "FRC.4272"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    compile("io.javalin:javalin:3.1.0")
    compile("org.slf4j:slf4j-simple:1.7.26")
    compile("com.fasterxml.jackson.core:jackson-databind:2.9.9")
    compile("com.google.code.gson:gson:2.8.0")
    compile("com.fasterxml.jackson.module:jackson-module-kotlin:2.9.9")
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
}
