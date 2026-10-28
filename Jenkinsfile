pipeline {
  agent any
  tools {
    jdk 'JDK25'
    maven 'Maven3'
  }
  options {
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Test and package') {
      steps {
        script {
          if (isUnix()) {
            sh 'mvn -B clean verify'
          } else {
            bat 'mvn -B clean verify'
          }
        }
      }
    }
    stage('Docker build') {
      when { expression { fileExists('Dockerfile') && isUnix() } }
      steps { sh 'docker build -t chaoslab:${BUILD_NUMBER} .' }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'target/*.jar', fingerprint: true, allowEmptyArchive: true
    }
    success { echo 'ChaosLab build, tests, and packaging completed successfully.' }
    failure { echo 'ChaosLab pipeline failed. Review the stage output above.' }
  }
}

