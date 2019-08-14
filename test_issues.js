const azdev = require('azure-devops-node-api');
const orgUrl = "https://tfs.byui.edu/tfs/BYUIDefault";
const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN;
const project = "8c129acc-610a-4993-b46c-9ce1f1e79534";
const projectArchive = "1a744ef1-8829-4ba6-b969-8d49e159ef2b";
let authHandler;
let connection;
let workItemTracking;

function handleError(err) {
    console.error(err);
    return;
}

async function createItem(connection) {
    // fields = await connection.getFieldsApi();
    // let items = await 
    workItemTracking = await connection.getWorkItemTrackingApi();
    const operations = [{
        op: "add",
        path: "/fields/System.Title",
        value: "Dev-Seth Work Item 2"
    }, {
        op: "add",
        path: "/fields/System.Description",
        value: "This is by far the most descriptive description."
    }, {
        "op": "add",
        "path": "/relations/-",
        "value": {
            "rel": "ArtifactLink",
            "url": "vstfs:///Git/Ref/Online%20Learning%20Archive%2FOnline%20Learning%20Archive%2FGBdev-Seth",
            "attributes": {
                "comment": "Connecting to branch dev-Seth",
                "name": "Branch"
            }
        }
    }];
    let item = await workItemTracking.createWorkItem(null, operations, projectArchive, 'Product Backlog Item');
    console.log(item);
    return;
}

async function main(connection) {
    workItemTracking = await connection.getWorkItemTrackingApi();
    let items = await workItemTracking.getWorkItems([2872], ["links"]);
    console.log(items);
    return;
}

async function getRelations(connection) {
    workItemTracking = await connection.getWorkItemTrackingApi();
    let items = await workItemTracking.getRelationTypes();
    console.log(JSON.stringify(items, null, 4));
    return;
}

async function start() {
    if (token == undefined) {
        console.log("You must set your AZURE_PERSONAL_ACCESS_TOKEN in environment variables.");
        return;
    } else {
        authHandler = azdev.getPersonalAccessTokenHandler(token);
        connection = new azdev.WebApi(orgUrl, authHandler);
    }
    // main(connection)
    createItem(connection)
        // getRelations(connection)
        .catch(handleError);
}

start();