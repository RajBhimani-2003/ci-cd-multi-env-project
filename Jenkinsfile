pipeline {
    agent {
        docker {
            image 'node:18-alpine'
        }
    }

    environment {
        DOCKER_IMAGE = "rajbhimani18/ci-cd-multi-env-project"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .'
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE:$BUILD_NUMBER'
            }
        }

        stage('Deploy to DEV') {
            when {
                branch 'dev'
            }
            steps {
                sh '''
                docker stop dev-container || true
                docker rm dev-container || true
                docker run -d -p 3001:3000 --name dev-container -e NODE_ENV=dev $DOCKER_IMAGE:$BUILD_NUMBER
                '''
            }
        }

        stage('Deploy to PROD') {
            when {
                branch 'main'
            }
            steps {
                input message: "Deploy to Production?"

                sh '''
                docker stop prod-container || true
                docker rm prod-container || true
                docker run -d -p 3000:3000 --name prod-container -e NODE_ENV=production $DOCKER_IMAGE:$BUILD_NUMBER
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline Success"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
    }
}