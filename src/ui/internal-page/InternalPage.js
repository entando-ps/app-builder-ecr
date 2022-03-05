import React from 'react';
import PropTypes from 'prop-types';
import ActivityStreamContainer from 'ui/activity-stream/ActivityStreamContainer';
import NotificationListContainer from 'ui/activity-stream/NotificationListContainer';

const InternalPage = ({ className, children }) => (
  <div
    data-testid="internal-page"
    className={['InternalPage', className, 'layout-pf-fixed'].join(' ').trim()}
  >
    <ActivityStreamContainer >
      <NotificationListContainer />
    </ActivityStreamContainer>
    <div className="container-fluid container-cards-pf container-pf-nav-pf-vertical" style={{ margin: '0px' }}>
      {children}
    </div>
  </div>
);

InternalPage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

InternalPage.defaultProps = {
  children: null,
  className: '',
};

export default InternalPage;
