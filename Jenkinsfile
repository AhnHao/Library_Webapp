pipeline {
    agent any

    stages {
        stage('Pull Code') {
            steps {
                git branch: 'master', url: 'git@github.com:AhnHao/Library_Webapp.git'
            }
        }
        stage('Build and Run Containers') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose build'
                sh 'docker-compose up -d'
            }
        }
    }
}

