# IPH React Project

## Introduction
The project is developed with React using ES6 features and it is created with [create-react-app](https://github.com/facebookincubator/create-react-app). React Router and Bootstrap are some of the libraries that are used in the project.


## Running Options

### Stage
```
npm run start:stage
```

### QA
```
npm run start:qa
```

### Live
```
npm run start:live
```

## Build Options

### Stage
```
npm run build:stage
```

### QA
```
npm run build:qa
```

### Live
```
npm run build:live
```

## Folder Structure

```
iph/
    README.md
    node_modules/
    package.json
    public/
        index.html
        favicon.ico
    src/
        index.js
        commons/
            css/
            mSDK.js
            mUtils.js
        components/
        containers/
            App/
            Intro/
            WorldMap/
```

`index.js` is entry-point for this project. The Bootstrap stuffs are imported here.

`commons` folder contains common-used files. All of the utils can be placed into `mUtils.js` file.

`mSDK.js` is an helper to make request. It contains 7 endpoints. The following code shows a sample usage.

```javascript
// ...
// SDK
import SDK from '../../commons/SDK';

// ...
// ...

SDK.getPillarList(
    (statusCode, response) => {
        console.log("Success", statusCode, response);
    },
    () => {
        console.log("Error");
    }
);
```

`components` folder contains small parts of the project. For example, the modals can be placed here.

`containers` folder contains pages of the project. Every page has a folder. 

## Changing Page Title
`document.title` can be used to change page title. The following code shows a sample usage.

```javascript
export default class Intro extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        document.title = "Intro Page";
    }
    
    render() {
        return (<div><h1>Intro Page</h1></div>);
    }
}
```