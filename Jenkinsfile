pipeline {
  agent any
  tools {
     nodejs 'Node'
    }
  stages {
    stage('Build Mobile Frontend') {
      steps {
        script {
        sh "npm install"
        sh "npm run build"
        }
      }
    }
    stage('Create Artifact Package') {
      steps {
         script {
            dockerHome = tool 'Docker'
            sh "tar czf build_${env.BUILD_TAG}.tar.gz build/**"
           }
        }
    } 
    stage('Build Docker Image') {
      steps {
         script {
            dockerHome = tool 'Docker'
            sh "${dockerHome}/bin/docker image build -t yahyaozturk/iph:${env.BUILD_TAG} ."
           }
        }
    }
    stage('Push Image to Dockerhub') {
      steps {
         script {
            dockerHome = tool 'Docker'
            sh "${dockerHome}/bin/docker login -u yahyaozturk -p Avis1111"
            sh "${dockerHome}/bin/docker push yahyaozturk/iph:${env.BUILD_TAG}"
           }
        }
    }    
    stage('Deploy to Preprod') {
      steps {
        echo 'hello Word'
      }
    }
    stage('Merge to Master') {
      steps {
        echo 'hello Word'
      }
    }
  }
}
