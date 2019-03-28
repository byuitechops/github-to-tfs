# github-to-tfs

## Description 
This tool allows users to automate the importation of git repositories from Github to TFS.

## How to Install

Standard Install

1. Clone this repository:
    ```bash
    git clone https://github.com/byuitechops/github-to-tfs.git
    ```
1. Step into the folder that was just created 
    ```bash
    cd ./github-to-tfs
    ```
1. To install dependencies, run:
    ```bash
    npm i
    ```

## How to Use
Run the following command to generate a csv and js file of all repos from Github:
```bash
npm start
```

Run this command to start puppeteer and the import of your repos to TFS:
```bash
npm run import
```
