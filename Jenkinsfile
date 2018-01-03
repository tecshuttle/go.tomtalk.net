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
                    sh 'pwd'
                    sh 'ls'
                }
                sh 'rm front-end@tmp -rf'
            }
        }
        stage('deliver') {
            steps {
                sh 'ls'
            }
        }
    }
}
