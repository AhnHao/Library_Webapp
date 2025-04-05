pipeline {
  agent any

  environment {
    MONGO_URI = credentials('MONGODB_URI')
    JWT_SECRET = credentials('JWT_SECRET')
  }

  stages {
    stage('Pull Code') {
      steps {
        git branch: 'master', 
        url: 'https://github.com/AhnHao/Library_Webapp.git',
        credentialsId: 'GITHUB_PAT'
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
        sh 'docker-compose down || true'
        sh 'docker-compose up -d'
      }
    }
  }
}
