import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchDatabaseDumpTable } from 'state/database/actions';
import DatabaseDumpTablePage from 'ui/database/dump/DatabaseDumpTablePage';
import { getTableDumpData } from 'state/database/selectors';
import withPermissions from 'ui/auth/withPermissions';
import { ROLE_SUPERUSER } from 'state/permissions/const';
import { setVisibleModal } from 'state/modal/actions';
import { getVisibleModal } from 'state/modal/selectors';

const MODAL_ID = 'DatabaseDumpPage';

export const mapStateToProps = state => ({
  dumpData: getTableDumpData(state),
  isModalOpen: getVisibleModal(state) === MODAL_ID,
});

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchDumpTable: () => {
    const { match: { params: { datasource, tableName, dumpCode } = {} } = {} } = ownProps;
    if (dumpCode && datasource && tableName) {
      dispatch(fetchDatabaseDumpTable(dumpCode, datasource, tableName));
      dispatch(setVisibleModal(MODAL_ID));
    }
  },
});

const DatabaseDumpTablePageContainer =
withRouter(connect(mapStateToProps, mapDispatchToProps)(DatabaseDumpTablePage));
export default withPermissions(ROLE_SUPERUSER)(DatabaseDumpTablePageContainer);
