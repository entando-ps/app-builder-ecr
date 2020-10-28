import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { LinkMenuItem } from '@entando/menu';
import { ROUTE_ABOUT, ROUTE_LICENSE } from 'app-init/router';
import InfoDropdown from 'ui/internal-page/InfoDropdown';

const InfoMenu = ({ onStartTutorial }) => (
  <InfoDropdown key="infoDropdown">
    <LinkMenuItem
      id="info-menu-about"
      to={ROUTE_ABOUT}
      label={<FormattedMessage id="app.about" />}
    />
    <LinkMenuItem
      id="info-menu-license"
      to={ROUTE_LICENSE}
      label={<FormattedMessage id="app.license" />}
    />
    <LinkMenuItem
      id="info-menu-start-tutorial"
      onClick={onStartTutorial}
      label={<FormattedMessage id="app.startTutorial" />}
    />
  </InfoDropdown>
);

InfoMenu.propTypes = {
  onStartTutorial: PropTypes.func.isRequired,
};

export default InfoMenu;
