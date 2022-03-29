import { connect } from 'react-redux';

import { fetchFragments } from 'state/fragments/actions';
import { getFragmentList, getFilters } from 'state/fragments/selectors';
import { getLoading } from 'state/loading/selectors';
import { getCurrentPage, getTotalItems, getPageSize, getLastPage } from 'state/pagination/selectors';
import { setColumnOrder } from 'state/table-column-order/actions';
import { getColumnOrder } from 'state/table-column-order/selectors';
import FragmentListTable from 'ui/fragments/list/FragmentListTable';
import { MODAL_ID } from 'ui/fragments/list/DeleteFragmentModal';
import { setVisibleModal, setInfo } from 'state/modal/actions';

export const mapStateToProps = state => (
  {
    fragments: getFragmentList(state),
    page: getCurrentPage(state),
    totalItems: getTotalItems(state),
    pageSize: getPageSize(state),
    lastPage: getLastPage(state),
    loading: getLoading(state).fragments,
    columnOrder: getColumnOrder(state, 'fragments'),
    filters: getFilters(state),
  }
);

export const mapDispatchToProps = dispatch => ({
  onWillMount: (page = { page: 1, pageSize: 10 }, params) => {
    dispatch(fetchFragments(page, params));
  },
  onSetColumnOrder: columnOrder => dispatch(setColumnOrder(columnOrder, 'fragments')),
  onClickDelete: (fragment) => {
    dispatch(setVisibleModal(MODAL_ID));
    dispatch(setInfo({ type: 'fragment', code: fragment.code }));
  },
});

const FragmentListTableContainer =
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
      pure: false,
    },
  )(FragmentListTable);

export default FragmentListTableContainer;
