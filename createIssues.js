const azdev = require('azure-devops-node-api'),
    request = require('request-promise'),
    d3 = require('d3-dsv'),
    fs = require('fs'),
    path = require('path'),
    pMap = require('p-map');

// TFS constants
const orgUrl = "https://tfs.byui.edu/tfs/BYUIDefault";
const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN;
const projectArchive = "1a744ef1-8829-4ba6-b969-8d49e159ef2b";
let authHandler;
let connection;
let workItemTracking;

// read CSV to see all repos
async function getInput() {
    // read in data from CSV
    var data = d3.csvParse(fs.readFileSync(path.resolve('./repos.csv'), 'utf-8'));
    // fetch Git API from az dev
    var gitApi = await connection.getGitApi();
    // get repos from tfs project
    var tfsRepos = await gitApi.getRepositories(projectArchive);
    // loop through repos and find all that have a matching name to a repo in TFS
    var newData = data.reduce((accum, repo) => {
        // find TFS repo with the same name as the repo
        let tfs = tfsRepos.find(el => el.name == repo.name);
        // if one exists then add TFS ID to repo and add to accumulator
        if (tfs != undefined) {
            repo.tfs = tfs.id;
            if (repo.name == "Online Development Archive") repo.name = "Online-Development-Archive"; // PLEASE REMOVE THIS LINE BEFORE RUNNING THANKS
            accum.push(repo);
        }
        return accum;
    }, []);

    // return
    return newData;
}

// loop through repos to find issues and call createItem()
async function main(repos) {
    // foreach repo find all issues
    pMap(repos, async repo => {
        var issues;
        // if there are any issues in the repo then...
        if (repo.open_issues > 0) {
            // ...go get the issue objects from GitHub
            issues = await getRepoIssues(`https://api.github.com/repos/byuitechops/${repo.name}/issues`);
            // foreach issue create issue items in TFS
            issues.forEach(async issue => {
                await createItem(issue, repo);
            });
        }
    }, { concurrency: 1 }); // your concurrency can probably be a lot higher.
}

// GitHub API call
async function getRepoIssues(uri) {
    // make a request promise to given URI to get issues from a repo
    return request({
        "method": "GET",
        "uri": uri,
        "json": true,
        "resolveWithFullResponse": true,
        "headers": {
            "User-Agent": "sbolande"
        }
    }).then(function (response) {
        var issues = [];

        // create issue objects from response
        response.body.forEach(issue => {
            issues.push({
                name: issue.title,
                description: issue.body,
                url: issue.html_url
            });
        });

        // return
        return issues;
    });
}

// create Work Item
async function createItem(issue, repo) {
    const operations = [{ // add Title to PBI
        op: "add",
        path: "/fields/System.Title",
        value: `${issue.name}`
    }, {                  // add Description to PBI
        op: "add",
        path: "/fields/System.Description",
        value: `${issue.description}`
    }, {                  // add ArtifactLink to Repo to PBI
        "op": "add",
        "path": "/relations/-",
        "value": {
            "rel": "ArtifactLink",
            "url": `vstfs:///Git/Ref/${projectArchive}%2F${repo.tfs}%2FGBmaster`,
            "attributes": {
                "comment": `Connecting to branch master of ${repo.name}`,
                "name": "Branch"
            }
        }
    }];
    // console.log(operations);

    // make API call to TFS to add new PBI
    let item = await workItemTracking.createWorkItem(null, operations, projectArchive, 'Product Backlog Item');
    console.log(item);
    return;
}

function handleError(err) {
    console.error(err);
    return;
}

/****************************************************************************************************/
async function start() {
    if (token == undefined) {
        console.log("You must set your AZURE_PERSONAL_ACCESS_TOKEN in environment variables.");
        return;
    } else {
        authHandler = azdev.getPersonalAccessTokenHandler(token);
        connection = new azdev.WebApi(orgUrl, authHandler);
        workItemTracking = await connection.getWorkItemTrackingApi();
    }

    getInput()
        .then(main)
        .catch(handleError);
}

start();