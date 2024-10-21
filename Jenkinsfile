pipeline {

    agent any
    environment{
        HOST_IP = '10.200.8.160'
        HOST_SSH_USER =  credentials('host_ssh_user_8_160')
        HOST_SSH_PASSWORD = credentials('host_ssh_password_8_160')
        PORT = 15103
    }
    
    stages {

        stage('Docker Building') {
        agent any
        steps {
            sh 'docker image rm glpi_msa_api || true'
            sh 'rm docker_glpi_msa_api_latest.tar || true'
            sh 'docker build -t glpi_msa_api .'
            sh 'docker save -o  docker_glpi_msa_api_latest.tar glpi_msa_api'
            sh 'ls'
        }
        }

        stage('Docker Transfer to Remote Host'){
        agent any
        steps{
            script{
                def remote = [:]
                remote.name = env.HOST_IP
                remote.host = env.HOST_IP
                remote.user = env.HOST_SSH_USER
                remote.password = env.HOST_SSH_PASSWORD
                remote.allowAnyHosts = true

                remote.fileTransfer = "sftp"
                sshCommand remote: remote, command: "pwd"
                sshCommand remote: remote, command: "mkdir -p glpi_docker_images"
                sshCommand remote: remote, command: "cd glpi_docker_images && rm  docker_glpi_msa_api_latest.tar || true"
                sshCommand remote: remote, command: "docker stop  \$( docker ps -q --filter ancestor=glpi_msa_api) || true"
                sshCommand remote: remote, command: "docker image rm glpi_msa_api || true"
                remote.fileTransfer = "scp"
                sshPut remote: remote, from: 'docker_glpi_msa_api_latest.tar', into: "glpi_docker_images"  
                remote.fileTransfer = "sftp"
                sshCommand remote: remote, command: "cd glpi_docker_images && docker load < docker_glpi_msa_api_latest.tar && docker image ls && docker ps"
            }  
        }
        }

        stage('Docker Cleaning') {
        agent any
        steps {
            script{
                def remote = [:]
                remote.name = env.HOST_IP
                remote.host = env.HOST_IP
                remote.user = env.HOST_SSH_USER
                remote.password = env.HOST_SSH_PASSWORD
                remote.allowAnyHosts = true
                            
                remote.fileTransfer = "sftp"
                sshCommand remote: remote, command: "docker stop  \$( docker ps -q --filter ancestor=glpi_msa_api) || true"
            }  
        }
        }  



        stage('Docker Run') {
        agent any
        steps {
            script{
                def remote = [:]
                remote.name = env.HOST_IP
                remote.host = env.HOST_IP
                remote.user = env.HOST_SSH_USER
                remote.password = env.HOST_SSH_PASSWORD
                remote.allowAnyHosts = true
                            
                remote.fileTransfer = "sftp"
                sshCommand remote: remote, command: "docker run -d -it --rm -p ${PORT}:15103 glpi_msa_api"
                sshCommand remote: remote, command: "docker image ls && docker ps"
            }  
        }
        }
    }
    
}


