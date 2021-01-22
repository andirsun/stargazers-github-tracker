# stargazers-github-tracker
Track the stargazers of github repos with the Oficial Github API - NestJs / node framework in TS

### Install
```
npm install
```
### Test - local
```
npm run start:dev
```
### Fetch stargazers daily
The service have an automatic function that executes every 24 hours, the function read the local database and update the stargazers for all repos.
### Add new repo
```
Get http://localhost:3000/repos/new?repo={user}/{repo-name}
```
### Get stargazers from specific repo
```
GET http://localhost:3000/repos/stargazers?repo={user}/{repo-name}

```
