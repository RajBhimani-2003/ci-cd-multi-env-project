pipeline {
    agent any

    environment {
        IMAGE_NAME = "rajbhimani18/ci-cd-multi-env-project"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                script {
                    docker.image('node:18-alpine').inside {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    docker.image('node:18-alpine').inside {
                        sh 'echo "Skipping tests"'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Login to DockerHub') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
    }
}
        stage('Push Docker Image') {
            steps {
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Deploy to DEV') {
            when {
                branch 'dev'
            }
            steps {
                sh '''
                docker stop dev-app || true
                docker rm dev-app || true
                docker run -d -p 3001:3000 --name dev-app $IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy to PROD') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                docker stop prod-app || true
                docker rm prod-app || true
                docker run -d -p 3002:3000 --name prod-app $IMAGE_NAME:latest
                '''
            }
        }
    }
}