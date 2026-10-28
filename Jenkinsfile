pipeline {
  agent any
  tools { jdk 'jdk17'; maven 'maven3' }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Test and package') { steps { sh 'mvn -B clean verify' } }
    stage('Docker build') { when { expression { fileExists('Dockerfile') && isUnix() } } steps { sh 'docker build -t chaoslab:${BUILD_NUMBER} .' } }
  }
  post { always { archiveArtifacts artifacts: 'target/*.jar', fingerprint: true, allowEmptyArchive: true } }
}
