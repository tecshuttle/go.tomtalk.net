pipeline {
    agent { docker 'node:9-alpine' }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'node -v'
                sh 'ls'
                sh 'cd front-end'
                sh 'ls'
                sh 'npm install'
            }
        }
        stage('test') {
            steps {
                sh 'echo "test"'
            }
        }
        stage('deliver') {
            steps {
                sh 'echo "deliver"'
            }
        }
    }
}
