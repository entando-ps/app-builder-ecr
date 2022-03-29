import React from 'react';
import PropTypes from 'prop-types';
import { ApiProvider } from '@entando/apimanager';
import {
  fetchPermissions,
  fetchLoggedUserPermissions,
  clearLoggedUserPermissions,
} from 'state/permissions/actions';
import { clearAppTourProgress, fetchWizardEnabled } from 'state/app-tour/actions';
import { addToast, TOAST_WARNING } from '@entando/messages';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { history, ROUTE_ECR_COMPONENT_LIST } from 'app-init/router';
import pluginsArray from 'entando-plugins';
import withAuth from 'auth/withAuth';
import getRuntimeEnv from 'helpers/getRuntimeEnv';
import { keycloak } from 'auth/keycloak/KeycloakProviderContainer';

const ApiManager = ({
  auth,
  intl,
  store,
  children,
}) => {
  const logout = (status) => {
    try {
      store.dispatch(clearLoggedUserPermissions());
      store.dispatch(clearAppTourProgress());
      if (keycloak) {
        const { origin } = window.location;
        keycloak.redirectUri = `${origin}${process.env.PUBLIC_URL || ''}${ROUTE_ECR_COMPONENT_LIST}`;
      }
      auth.logout(status);
    } catch (err) {
      // can occur when keycloak is still loading
    }
  };

  const state = store.getState();

  const currentUserName = ((state || {}).currentUser || {}).username;

  const goHome = () => {
    if (auth.enabled && auth.toRefreshToken) {
      auth.setToRefreshToken(false);
    } else {
      store.dispatch(fetchWizardEnabled(currentUserName));
      store.dispatch(fetchPermissions())
        .then(() => store.dispatch(fetchLoggedUserPermissions()));
      const goto = ROUTE_ECR_COMPONENT_LIST;
      history.push(goto);
    }
  };

  const useMocks = process.env.USE_MOCKS;

  if (useMocks) {
    const msgs = defineMessages({
      usingMocks: {
        id: 'app.usingMocks',
        defaultMessage: 'Using Mocks',
      },
    });
    store.dispatch(addToast(
      intl.formatMessage(msgs.usingMocks),
      TOAST_WARNING,
    ));
  }

  const { DOMAIN } = getRuntimeEnv();

  return (
    <ApiProvider
      onLogout={logout}
      onLogin={goHome}
      store={store}
      domain={DOMAIN}
      useMocks={useMocks}
      plugins={pluginsArray}
    >
      {children}
    </ApiProvider>
  );
};

ApiManager.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    logout: PropTypes.func.isRequired,
    enabled: PropTypes.bool,
    toRefreshToken: PropTypes.bool,
    setToRefreshToken: PropTypes.func.isRequired,
  }).isRequired,
  intl: intlShape.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default withAuth(injectIntl(ApiManager));
