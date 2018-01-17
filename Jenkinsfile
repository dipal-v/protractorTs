@Library('CAA-Ceres-CI')
import com.inmarsat.caa.SonarQube
import com.inmarsat.caa.Leto

sonar = new SonarQube()
leto = new Leto()

node('master') {
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
        slack_stage('Prepare', ':nodejs:') {
            leto.prepare()
        }
        stage('Test'){
            parallel (
                "Unit Test": {
                    slack_stage('Unit Test', ':jestjs:'){
                        leto.jest()
                    }
                },
                "BDD Test": {
                    slack_stage('BDD Test', ':cucumberjs:'){
                        leto.cucumber()
                    }
                },
                "Vulnerability Check": {
                    slack_stage('Vulnerability', ':snyk:'){
                        leto.snyk()
                    }
                }
            )
        }
        slack_stage('SonarQube analysis', ':sonarqube:') {
            sonar.analyzeLeto()
        }
    }
}
