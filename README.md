# VELOCE INTEGRATION SEED

### PREREQUSITES:

- node 16+
- npm 7+
- sfdx-cli 7+

### QUICK START:

Create global variable NEXUS_NPM_AUTH with Veloce Nexus authorization token 
Install dependencies:

```
NEXUS_NPM_AUTH={{token}}
npm i
```

Authorize an org using `sfdx` command

```
sfdx force:auth:web:login -r https://test.salesforce.com -a org
```

Install `veloce-sfdx-v3` plugin

```
sfdx plugins:install veloce-sfdx-v3
```

Open browser dev tools and from nine-dot menu launch **Veloce Studio**
Copy authorization token from any XHR request
Update `window.VELO_KEY` (in `src\index.html`) with said token
Copy host URL from any XHR request (ex. https://my-org-velo-cpq-dot-spheric-baton-328205.ue.r.appspot.com)
Update `target` property of `/services/*` object in `src\proxy.conf.json` with said URL

Start the local backend service:

```
npm run api
```

Start the app:

```
npm run start
```

### GET UI DEFINITIONS:

Start the app:

```
sfdx veloce:source:pull -m config-ui:MyProductModel
```
