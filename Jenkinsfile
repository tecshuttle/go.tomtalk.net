pipeline {
    agent { docker 'node:9-alpine' }
    stages {
        stage('build') {
            steps {
                dir 'front-end'
                sh 'npm --version'
                sh 'node -v'
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
