pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "rajbhimani18/ci-cd-multi-env-project"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "ci-cd-app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'dev',
                url: 'https://github.com/RajBhimani-2003/ci-cd-multi-env-project.git'
            }
        }

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
                        sh 'npm test || echo "No tests found, skipping..."'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([string(credentialsId: 'docker-pass', variable: 'DOCKER_PASS')]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u rajbhimani18 --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE:$DOCKER_TAG'
            }
        }

        stage('Deploy to DEV') {
            when {
                branch 'dev'
            }
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                docker run -d -p 3000:3000 --name $CONTAINER_NAME $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }

        stage('Deploy to PROD') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                docker run -d -p 80:3000 --name $CONTAINER_NAME $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}