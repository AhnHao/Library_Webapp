pipeline {
  agent any

  environment {
    MONGO_URI = credentials('mongo_uri')
    JWT_SECRET = credentials('jwt_secret')
  }

  stages {
    stage('Pull Code') {
      steps {
        git branch: 'master', url: 'git@github.com:AhnHao/Library_Webapp.git'
      }
    }

    stage('Create .env') {
      steps {
        dir('server') {
          writeFile file: '.env', text: """
                            MONGO_URI=${env.MONGO_URI}
                            JWT_SECRET=${env.JWT_SECRET}
                            PORT=3000
                            """
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Restart Containers') {
      steps {
        sh 'docker-compose down'
        sh 'docker-compose up -d'
      }
    }
  }
}
