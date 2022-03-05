import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import registerServiceWorker from 'registerServiceWorker';

// state manager (Redux)
import { Provider } from 'react-redux';
import store from 'state/store';

import { history } from 'app-init/router';
import 'app-init/locale';

import IntlProviderContainer from 'ui/locale/IntlProviderContainer';
import AuthProvider from 'auth/AuthProvider';
import ApiManager from 'app-init/apiManager';

import AppContainer from 'ui/app/AppContainer';

import 'patternfly/dist/css/patternfly.min.css';
import 'patternfly/dist/css/patternfly-additions.min.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog.css';
import '@entando/menu/dist/css/index.css';
import '@entando/pages/dist/css/index.css';
import '@entando/pagetreeselector/dist/css/index.css';
import '@entando/datatable/dist/css/index.css';

import 'index.scss';

class EntEcr extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('span');
    this.render();
  }


  render() {
    ReactDOM.render(
      <Provider store={store}>
        <AuthProvider store={store}>
          <IntlProviderContainer>
            <ApiManager store={store}>
              <HashRouter history={history}>
                <AppContainer />
              </HashRouter>
            </ApiManager>
          </IntlProviderContainer>
        </AuthProvider>
      </Provider>,
      this.appendChild(this.mountPoint),
    );
  }
}

registerServiceWorker();

if (!customElements.get('ent-ecr')) {
  customElements.define('ent-ecr', EntEcr);
}
