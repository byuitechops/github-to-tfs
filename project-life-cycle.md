# Project Capture Document for Github to TFS
#### *Author: Emma Fisher*
#### *Stakeholder: Josh McKinney*
#### *Date: 3/19/2019*


## Background

We need to transfer all the repositories from Github to TFS. Doing this by hand would be very time consuming.



-----

## Definition of Done

We are creating a tool that will automate the transfer of repositories from Github to TFS.





-----

# Requirements

### General Requirements

### Input Requirements

#### Source of Inputs

Inputs are all the repository clone URLs that Josh says need to be moved over. These URLs can be obtained through the code written to cloneUrls.js or by navigating to Github and getting the clone URL.


#### Definition of Inputs

Repository clone URL: Array in cloneUrl.js

---

### Output Requirements
#### Destination

Output is a puppeteer program that clicks through and imports all the repos listed into TFS.


#### Definition of Outputs

<!-- List here a type definition for each output? For example, if the changes are directly to the LMS, list all changes that occur. If it is a CSV define the column names. If it is a JSON, give an example of the JSON structure. -->

---

### User Interface

#### Type:

<!-- CLI with Flags, CLI With Prompt, Web Page, Server, Library, etc -->

<!-- What are the flags, what are Major Questions, Images of UX/UI Design. -->

-----

## Expectations

### Timeline
Depends on when Stakeholder finished their part

### Best Mode of Contact
Slack

### Next Meeting
N/A

### Action Items
Discussed what we need to accomplish and how we will do it. Tasks listed below.
#### TechOps
* write code to pull repos from Github and add them to TFS
* look into how we can move issues (API?)
#### Stakeholder
* sort through repos to see which ones should moved and when, and also which should be archived

-----

#### *Approved By: Josh McKinney* 
#### *Approval Date: 2/20/2019*
