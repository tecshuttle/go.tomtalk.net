pipeline {
    agent { docker 'node9' }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'echo "hello Jenkins."'
            }
        }
    }
}
