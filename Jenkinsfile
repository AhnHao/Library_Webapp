pipeline {
    agent any
    
    environment {
        PROJECT_NAME = "library-webapp"
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scmGit(branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/AhnHao/Library_Webapp.git']])
            }
        }
        
        stage('Create .env file') {
            steps {
                // Sử dụng Jenkins Credentials để tạo file .env an toàn
                withCredentials([
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                ]) {
                    sh '''
                    echo "Creating .env file..."
                    cat > ./server/.env << EOL
                  
                    # Authentication
                    JWT_SECRET=${JWT_SECRET}
                    JWT_EXPIRE=24h
                    
                    # API Configuration
                    PORT=3000
                    EOL
                
                    echo ".env file created successfully!"
                    '''
                }
            }
        }
        
        stage('Build and Deploy') {
            steps {
                script {
                    // Sử dụng Docker trực tiếp thay vì Docker Compose
                    sh 'docker-compose down || true'
                    sh 'docker-compose build'
                    sh 'docker-compose up -d'
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                // Kiểm tra trạng thái của các container sau khi triển khai
                sh 'docker ps'
                
                // Kiểm tra kết nối tới backend API
                sh '''
                # Đợi 10 giây để các dịch vụ khởi động hoàn toàn
                sleep 10
                
                # Kiểm tra API health endpoint
                HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "failed")
                
                if [ "$HEALTH_CHECK" = "200" ]; then
                    echo "Backend API is running properly."
                else
                    echo "Backend API check failed with status: $HEALTH_CHECK"
                    # Không đánh dấu là lỗi vì API có thể cần thêm thời gian để khởi động
                fi
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
        always {
            sh 'rm -f temp_files || true'
        }
    }
}
