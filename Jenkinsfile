pipeline {
    agent { docker 'node:9-alpine' }
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
                    sh('cd front-end && ls')
                }
            }
        }
        stage('deliver') {
            steps {
                sh 'ls'
            }
        }
    }
}
