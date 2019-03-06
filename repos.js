const fs = require('fs');
const json2csv = require('json2csv').parse;
const request = require('request-promise');



function getUserRepos(uri, repos) {
    return request({
        "method": "GET",
        "uri": uri,
        "json": true,
        "resolveWithFullResponse": true,
        "headers": {
            "User-Agent": "emmafisher1720"
        }
    }).then(function (response) {
        if (!repos) {
            repos = [];
        }
        response.body.forEach(repo => {
            repos.push({
                name: repo.name,
                clone_url: repo.clone_url,
                open_issues: repo.open_issues,
                url: repo.html_url
            });
        });
        console.log(repos.length + " repos so far");

        if (response.headers.link.split(",").filter(function (link) { return link.match(/rel="next"/) }).length > 0) {
            var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function (link) { return link.match(/rel="next"/) })[0])[1];
            return getUserRepos(next, repos);
        }
        writeToCsv(repos);
        return repos;
    });
}

function writeToCsv(repos) {
    var fields = ['Name', 'Clone Url', 'Has Issues', 'Url'];
    var csv = json2csv(repos, fields);
    fs.writeFile('repos.csv', csv, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved');
    })
}


getUserRepos('https://api.github.com/orgs/byuitechops/repos?per_page=100');


