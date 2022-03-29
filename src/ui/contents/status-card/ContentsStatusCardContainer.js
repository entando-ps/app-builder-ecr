import { connect } from 'react-redux';

import { adminConsoleUrl } from 'helpers/urlUtils';
import { fetchContentsStatus } from 'state/contents/actions';
import { getContentsStatus } from 'state/contents/selectors';

import { withPermissionValues } from 'ui/auth/withPermissions';

import ContentsStatusCard from 'ui/contents/status-card/ContentsStatusCard';
import { getLocale } from 'state/locale/selectors';

const mapStateToProps = state => ({
  language: getLocale(state),
  contentsStatus: getContentsStatus(state),
});

const mapDispatchToProps = dispatch => ({
  onDidMount: () => {
    dispatch(fetchContentsStatus());
  },
  onClickContentList: () => {
    window.location.href = adminConsoleUrl('do/jacms/Content/list.action');
  },
});

const ContentsStatusCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContentsStatusCard);

export default withPermissionValues(ContentsStatusCardContainer);
