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
                has_issues: repo.has_issues,
                url: repo.html_url
            });
        });
        console.log(repos.length + " repos so far");

        if (response.headers.link.split(",").filter(function (link) { return link.match(/rel="next"/) }).length > 0) {
            console.log("There is more.");
            var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function (link) { return link.match(/rel="next"/) })[0])[1];
            return getUserRepos(next, repos);
        }
        var fields = ['Name', 'Clone Url', 'Has Issues', 'Url'];
        var csv = json2csv(repos, fields);
        fs.writeFile('repos.csv', csv, 'utf8', (err) => {
            if (err) throw err;
            console.log('The file has been saved');
        })
        return repos;
    });
}


(function () {
    getUserRepos('https://api.github.com/orgs/byuitechops/repos?per_page=100');
}());

