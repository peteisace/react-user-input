import 'react-hot-loader/patch';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './core/App';
import './scss/master.scss';

ReactDOM.render(
    <AppContainer>
        <App />
    </AppContainer>,
    document.getElementById('react-root')
);

if(module.hot) {    
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

