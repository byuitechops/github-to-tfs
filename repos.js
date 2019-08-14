const fs = require('fs');
const json2csv = require('json2csv').parse;
const request = require('request-promise');

var cloneUrls = [];

/* Sends an API request to Github asking for a list of all the repositories under byuitechops */
function getUserRepos(uri, repos) {
    return request({
        "method": "GET",
        "uri": uri,
        "json": true,
        "resolveWithFullResponse": true,
        "headers": {
            "User-Agent": "sbolande"
        }
    }).then(function (response) {
        /* If the arrat repos doesn't exist (the first time the call is made), create it */
        if (!repos) {
            repos = [];
        }
        /* For each repo, it will push a json object with the name, clone url, if there are open issues, and url in github */
        response.body.forEach(repo => {
            repos.push({
                name: repo.name,
                clone_url: repo.clone_url,
                open_issues: repo.open_issues,
                url: repo.html_url
            });
            cloneUrls.push(`'${repo.clone_url}'`);
        });
        console.log(repos.length + " repos so far");
        /* Checks the response header to see if there are more calls to be made (if there are more repos) since it willonly grab 100 per call */
        if (response.headers.link.split(",").filter(function (link) { return link.match(/rel="next"/) }).length > 0) {
            var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function (link) { return link.match(/rel="next"/) })[0])[1];
            return getUserRepos(next, repos);
        }
        writeToCsv(repos);
        writeCloneUrlsToJson(cloneUrls);
        return repos;
    });
}

/* Writes the array with json objects in it to a csv */
function writeToCsv(repos) {
    var fields = ['Name', 'Clone Url', 'Has Issues', 'Url'];
    var csv = json2csv(repos, fields);
    fs.writeFile('repos.csv', csv, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved');
    })
}

/* Writes solely the clone urls to a javascript file that has an array of all the urls */
function writeCloneUrlsToJson(cloneUrl) {
    fs.writeFile('cloneUrls.js', cloneUrl, 'utf8', (err) => {
        if (err) throw err;
        console.log("Done");
    })
}

/* Makes the original call with the correct URL */
getUserRepos('https://api.github.com/orgs/byuitechops/repos?per_page=100');
