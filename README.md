# VELOCE INTEGRATION SEED

## PREREQUSITES:

- node 16+
- npm 7+
- sfdx-cli 7+

## QUICK START:

Create global variable NEXUS_NPM_AUTH with Veloce Nexus authorization token and install dependencies:

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

Setup the app:

- Open browser dev tools and from nine-dot menu launch **Veloce Studio**
- Copy authorization token from any XHR request
- Update `window.VELO_KEY` (in `apps/host/src/index.html`) with said token
- Copy host URL from any XHR request (ex. https://my-org-velo-cpq-dot-spheric-baton-328205.ue.r.appspot.com)
- Update `target` property of `/services/*` object in `apps/host/src/proxy.conf.json` with said URL

Start the app:

```
npm run start
```

## HOW TO

### Get UI definitions from org:

```
sfdx veloce:source:pull -m config-ui:MyProductModel
```

### Start DEMO configuration application:

1. Push Demo product model to the target Salesforce org:

```
sfdx veloce:source:push -m model:Demo
```

2. Start host application (including angular Demo module):

```
npm run start:demo
```

3. Open `http://localhost:4202` in the browser and run Demo model configuration UI.
