pipeline {
    agent { docker 'node:9-alpine' }
    environment {
        CI = 'true' 
    }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'node -v'
                sh 'ls'                
            }
        }
        stage('test') {
            steps {
                dir('front-end') {
                    sh('cd front-end && sudo npm install')
                }
            }
        }
        stage('deliver') {
            steps {
                sh 'rm front-end@tmp -rf'
                sh 'ls'
            }
        }
    }
}
