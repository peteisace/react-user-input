# Create-React-Simple

## TL;DR ##
To work with the webpack dev server + the coveted HMR, simply run the npm command

*npm run start*

## Anything Coming? ##
I do fully intend to build proper package & command so it can be used via npx and not have to go through the boredom of clone, rename, run. Then ofc, you know what they say about intentions... Seriously tho, it's windingg me up so I will do it.

## Why does this exist?
It makes life easier for me... The true *create-react-app* does things I don't necessarily want it to (That damn serviceworker for example), doesn't do things I want it to, and probably the biggest driver of all: the hot module replacement just doesn't seem to work properly. Maybe it's me. Maybe it's not. Whatever. I find that it only takes one or two changes and then the HMR gives up / stops working and I don't know why.

The key differences are listed below:

### Typescript In From Start ###
Legitimately could be criticized as a disadvantage since there's no option to remove. Again this was created to save me time hence the selfishness! The key things to note here is the dedicated models location: *~/src/ts/[area]* with the thought being to subdivide the folders like java packages - e.g.: ~/src/ts/security/userLoginRequest.ts, ~/src/ts/orders/orderInfo.ts. Similarly regarding the React components the key files are:

* *1) Entry point (Invoke ReactDOM.render, push content to React-root div element): ~/src/index.tsx*
* *2) Root component (React component that contains all other components - I dislike multiple ReactDOM calls. This is created by the above step: ~/src/core/App.tsx*

### SASS included and working ###
I like SASS very much. It helped me get over my fear of CSS. I am quite particular about how I use it and prefer not to have to set it up each and every time. In this simple version the main SASS file **~/src/scss/master.scss** is setup with dependencies on *settings.scss* and Eric Meyer's awesome *reset.scss*, and then imported by the main React component: **~/src/index.tsx**

```javascript
// do some other imports
import '../scss/master.scss'

ReactDOM.render( /* stuff */ )
```

### HtmlWebpackPlugin baked in ###
It's likely the true create-react-app also does this, I didn't check. But to ensure that everything is automated, templated I'm using the HtmlWebpackPlugin. Basically means my index.html the user sees is created in similar manner to the javascript, css fikles they see. Explained properly at https://github.com/jantimon/html-webpack-plugin

For brevity you just need to know that template is configured in the webpack.config:

```javascript
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',  // location of static template file
        title: 'Base setup for react projects: Simplified.', // Hardcoded title, can replace 
        // with function (that calls API for example for translated text)
        inject: true         
    })
]
```

### Folder structure ###
Of course this is highly personal and I'll be the only one on this planet that likes what I've done here. Still:

* All files that help with creating final bundle found under *~/src/*
* React components located in *~/src/[area]* e.g.: ~/src/core/App.tsx, ~/src/security/login.tsx
* SASS files found in *~/src/scss/[sass file u want]*
* Index.html template: *~/src/index.html*
* Main React entry point: *~/src/index.tsx*
* Typescript model files (ts, not tsx) found in *~/src/ts/[area]/myfile.ts*
* All of this easily changed by altering the webpack.config
* "Bundle" dropped into *~/wwwroot/[area]* e.g.: ~/wwwroot/styles/mycss.css. Can be changed via webpack.config, although most of it hangs off the output directory relatively.

### Simple & Easy to Change ###
In my opinion there's a bit of over engineering in the true create-react-app with the ServiceWorker and the React-scripts that make it hard to make and apply changes if the setup is not exactly how you need it. This derivative is much simpler and therefore easier to change. The only real moving parts are:

* Webpack config file - ~/webpack.config.js. Anything that needs to be read, processed, created is defined here. Vast majority of change will need to be here.
* Project package.json file: ~/package.json. Shouldn't need to do anything here unless you want to alter the commands which is what makes it do the necessary interesting stuff.
* Index.html file - no need for detail here since it just employs HtmlWebpackPlugin whichg explains things far better than I could.

### HMR works ###
I don't know what I'm doing wrong with the real version. Almost certainly I'm at fault. Don't care so much; it doesn't work and I've to go on a detective mission to ascertain why. All I've done here is to include the react hot module loader and change the entry point so it is used here. This seemed to stop the behavior of the first couple oif changes happening without issue and then... just stops.

```javascript
// Inside entry point: ~/src/index.tsx:
ReactDOM.render(
    <AppContainer>
        <App />
    </AppContainer>,
    document.getElementById('react-root')
);

if(module.hot) {    // IDEs will often show error here - ensure that @types/webpack-env is part of the devDependencies.
    module.hot.accept('./core/App', () => {
        
        const NextApp = require('./core/App').default;

        ReactDOM.render(
            <AppContainer>                
                <NextApp />                
            </AppContainer>,
            document.getElementById('react-root')
        );
    });
}
```

## How to use it ##
Up to you really. I intent to clone & edit it for each project where I want it for a base. All that needs changing is the HtmlWebpackPlugin stuff for the title, index.html template, and then the contents of the root component ~/src/core/App.tsx.

#### First time pre-reqs ####
Before running it as norm you will need to do the below. After that you can use normally. 

* Get everything required installed via npm / yarn

*npm install*

(Previously I've had some problems with babel-loader; if you get some error pertaining to that simply install it again:)

    yarn add babel-loader

* You will then need to build, create output via another package.json npm command. I did use to have this do a prod build & webpack watch with this, but tbh more often I just wanted the output & dirs created.

*npm run build*

Now you should have a ~/wwwroot full of content and subdirs. It worked. W00t. We can now run and use as normal.

#### Running it Normally ####

To work with the webpack dev server + the coveted HMR, simply run the npm command

*npm run start*

This will start the dev server, a browser, and enable the HMR

## What about my server stuff? ##
Up to you really. What I do is, partially because server and client are in different repos:

* Create symbolic link to the server code under ~/src/server
* Create a shell script start.sh
  * Which compiles the server code
  * Runs it from the command line
  * Traps CTRL-C so that
  * I can grab the PID of the server process and on trap I kill that process too
  * This enables me to treat client & server as the same even if they are not
* Change package.json to call the start.sh script as well as run the webpack server: 
```javascript
"start": "sh start.sh && NODE_ENV=development webpack-dev-server --hot --open",
```

This has worked for me, but it's purely a suggestion: there's a 1000 server implementations and would be an act of masochism to try and cater for all. As such this is purely a client with a (weak) suggestion on how to cooperate with the server code.
