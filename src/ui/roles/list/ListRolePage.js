import React from 'react';
import { Grid, Row, Col, Breadcrumb, Button } from 'patternfly-react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import BreadcrumbItem from 'ui/common/BreadcrumbItem';
import InternalPage from 'ui/internal-page/InternalPage';
import PageTitle from 'ui/internal-page/PageTitle';
import RoleListTableContainer from 'ui/roles/list/RoleListTableContainer';
import { ROUTE_ROLE_ADD } from 'app-init/router';
import withPermissions from 'ui/auth/withPermissions';
import { SUPERUSER_PERMISSION } from 'state/permissions/const';
import { TEST_ID_ROLE_LIST_PAGE } from 'ui/test-const/role-test-const';

export const ListRolePageBody = () => (
  <InternalPage className="ListRolePage">
    <Grid fluid>
      <Row>
        <Col xs={12}>
          <Breadcrumb>
            <BreadcrumbItem>
              <FormattedMessage id="menu.userManagement" />
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <FormattedMessage id="menu.roles" />
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <PageTitle
            titleId="menu.roles"
            helpId="role.help"
            data-testid="user-roles"
          />
        </Col>
      </Row>
      <Row>
        <RoleListTableContainer />
      </Row>
      <br />
      <Row>
        <Col md={12}>
          <Link to={ROUTE_ROLE_ADD}>
            <Button
              type="button"
              className="pull-right ListRolePage__add"
              bsStyle="primary"
              data-testid={TEST_ID_ROLE_LIST_PAGE.ADD_ROLE_BUTTON}
            >
              <FormattedMessage
                id="app.add"
              />
            </Button>
          </Link>
        </Col>
      </Row>
    </Grid>
  </InternalPage>
);

export default withPermissions(SUPERUSER_PERMISSION)(ListRolePageBody);
