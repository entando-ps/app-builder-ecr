import React from 'react';
import { Grid, Row, Col } from 'patternfly-react';
import InternalPage from 'ui/internal-page/InternalPage';
import SidebarContainer from 'ui/component-repository/SidebarContainer';
import SearchBarContainer from 'ui/component-repository/components/SearchBarContainer';
import FilterTypeContainer from 'ui/component-repository/components/FilterTypeContainer';
import ComponentListContainer from 'ui/component-repository/components/list/ComponentListContainer';
import ComponentListViewModeSwitcherContainer from 'ui/component-repository/components/list/ComponentListViewModeSwitcherContainer';
import withPermissions from 'ui/auth/withPermissions';
import { FormattedMessage } from 'react-intl';
import { ENTER_ECR_PERMISSION, SUPERUSER_PERMISSION } from 'state/permissions/const';
import ExtraTabBarFilterContainer from 'ui/component-repository/ExtraTabBarFilterContainer';
import InstallationPlanModal from 'ui/component-repository/components/InstallationPlanModal';

export const ComponentListPageBody = () => (
  <InternalPage className="ComponentListPage">
    <Grid fluid>
      <div className="ComponentListPage__body">
        <Row>
          <Col md={3}>
            <SidebarContainer />
          </Col>
          <Col md={9}>
            <div className="ComponentListPage__container">
              <div className="ComponentListPage__container-header">
                <div className="ComponentListPage__container-header-title">
                  <FormattedMessage id="componentRepository.categories.component" />
                </div>
                <div className="ComponentListPage__container-header-actionbar">
                  <div>
                    <FilterTypeContainer />
                    <SearchBarContainer />
                  </div>
                  <div>
                    <ExtraTabBarFilterContainer />
                  </div>
                  <div>
                    <ComponentListViewModeSwitcherContainer />
                  </div>
                </div>
              </div>
              <div className="ComponentListPage__container-body">
                <ComponentListContainer />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Grid>
    <InstallationPlanModal />
  </InternalPage>
);

export default withPermissions([SUPERUSER_PERMISSION, ENTER_ECR_PERMISSION])(ComponentListPageBody);
