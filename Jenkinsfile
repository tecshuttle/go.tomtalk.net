pipeline {
    agent { docker 'node:9-alpine' }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'node -v'
                sh 'ls'
                sh 'cd front-end'
                sh 'npm install'
            }
        }
    }
    stages {
        stage('test') {
            steps {
                sh 'echo "test"'
            }
        }
    }
    stages {
        stage('deliver') {
            steps {
                sh 'echo "deliver"'
            }
        }
    }
}
