pipeline {
  agent any

  environment {
    MONGO_URI = credentials('MONGODB_URI')
    JWT_SECRET = credentials('JWT_SECRET')
    GIT_COMMIT_SHORT = "${env.GIT_COMMIT[0..6]}"
    IMAGE_TAG = "library_webapp:${env.BUILD_NUMBER}"
    PROJECT_NAME = "library_webapp"
  }

  options {
    timestamps()
    skipStagesAfterUnstable()
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/master']],
          userRemoteConfigs: [[
            url: 'https://github.com/AhnHao/Library_Webapp.git',
            credentialsId: 'GITHUB_PAT'
          ]],
          cleanBeforeCheckout: false
        ])
      }
    }

    stage('Setup Environment File') {
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

    stage('Clean Old Containers & Volumes') {
      steps {
        sh 'docker-compose down -v || true'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh """
          echo "Building Docker image with tag: ${IMAGE_TAG}"
          docker-compose build --no-cache
        """
      }
    }

    stage('Prune Unused Docker Images') {
      steps {
        sh 'docker image prune -af --filter "until=24h" || true'
      }
    }

    stage('Deploy Application') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }

  post {
    success {
      echo "Deployment successful: ${PROJECT_NAME} - Build #${BUILD_NUMBER}"
    }
    failure {
      echo "Deployment failed!"
    }
    cleanup {
    }
  }
}
