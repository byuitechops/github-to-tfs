const fs = require('fs');
const path = require('path');
const d3 = require('d3-dsv');

(function main() {
    var repos = d3.csvParse(fs.readFileSync(path.resolve('./repos.csv'), 'utf-8'));
    var data = "";
    repos.forEach(repo => {
        data += `az repos create --name ${repo.name} -p 1a744ef1-8829-4ba6-b969-8d49e159ef2b\naz repos import create --git-source-url ${repo.clone_url} -p 1a744ef1-8829-4ba6-b969-8d49e159ef2b -r ${repo.name}\n`;
    });
    fs.writeFileSync('./importReposToTfs.bat', data);
})();