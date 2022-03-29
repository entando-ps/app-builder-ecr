import { addToast, addErrors, TOAST_ERROR, TOAST_SUCCESS } from '@entando/messages';

import {
  getGroups,
  getMyGroups,
  postGroup,
  getGroup,
  putGroup,
  deleteGroup,
  getReferences,
} from 'api/groups';
import { setPage } from 'state/pagination/actions';
import { toggleLoading } from 'state/loading/actions';
import { getReferenceKeyList, getSelectedRefs } from 'state/groups/selectors';
import {
  SET_GROUPS,
  SET_SELECTED_GROUP,
  SET_REFERENCES,
  REMOVE_GROUP,
  SET_GROUPS_TOTAL,
  SET_GROUP_ENTRIES,
} from 'state/groups/types';
import { history, ROUTE_GROUP_LIST } from 'app-init/router';

export const setGroups = groups => ({
  type: SET_GROUPS,
  payload: {
    groups,
  },
});

export const setGroupsTotal = groupsTotal => ({
  type: SET_GROUPS_TOTAL,
  payload: {
    groupsTotal,
  },
});

export const setSelectedGroup = group => ({
  type: SET_SELECTED_GROUP,
  payload: {
    group,
  },
});

export const clearSelectedGroup = () => ({
  type: SET_SELECTED_GROUP,
  payload: {
    group: {},
  },
});

export const removeGroupSync = groupCode => ({
  type: REMOVE_GROUP,
  payload: {
    groupCode,
  },
});

export const setGroupEntries = groups => ({
  type: SET_GROUP_ENTRIES,
  payload: {
    groups,
  },
});

// thunk

export const fetchMyGroups = ({ sort } = {}) => dispatch => new Promise((resolve) => {
  dispatch(toggleLoading('groups'));
  getMyGroups().then((response) => {
    response.json().then((data) => {
      if (response.ok) {
        const groups = data.payload.slice();
        if (sort) {
          groups.sort((a, b) => a[sort].localeCompare(b[sort]));
        }
        dispatch(setGroups(groups));
        dispatch(toggleLoading('groups'));
        resolve();
      } else {
        dispatch(addErrors(data.errors.map(err => err.message)));
        data.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
        dispatch(toggleLoading('groups'));
        resolve();
      }
    });
  }).catch(() => {});
});

export const fetchGroupsTotal = () => dispatch => (
  new Promise((resolve) => {
    getGroups({ page: 1, pageSize: 1 }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          dispatch(setGroupsTotal(data.metaData.totalItems));
        } else {
          dispatch(addErrors(data.errors.map(err => err.message)));
          data.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
        }
        resolve();
      });
    }).catch(() => {});
  })
);

export const fetchGroup = groupCode => dispatch => (
  new Promise((resolve) => {
    getGroup(groupCode).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          dispatch(setSelectedGroup(data.payload));
          resolve();
        } else {
          dispatch(addErrors(data.errors.map(err => err.message)));
          data.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
          resolve();
        }
      });
    }).catch(() => {});
  })
);

export const sendPutGroup = groupData => dispatch => (
  new Promise((resolve) => {
    putGroup(groupData).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          dispatch(addToast(
            { id: 'app.updated', values: { type: 'group', code: groupData.code } },
            TOAST_SUCCESS,
          ));
          history.push(ROUTE_GROUP_LIST);
          resolve();
        } else {
          dispatch(addErrors(data.errors.map(err => err.message)));
          data.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
          resolve();
        }
      });
    }).catch(() => {});
  })
);

export const sendPostGroup = groupData => (dispatch, getState) => (
  new Promise((resolve) => {
    postGroup(groupData).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          dispatch(addToast(
            { id: 'app.created', values: { type: 'group', code: groupData.code } },
            TOAST_SUCCESS,
          ));
          // update store with new group
          const { groups } = getState();
          dispatch(setGroups([...groups.groupEntries, groupData]));
          history.push(ROUTE_GROUP_LIST);
          resolve();
        } else {
          dispatch(addErrors(data.errors.map(err => err.message)));
          data.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
          resolve();
        }
      });
    }).catch(() => {});
  })
);

export const sendDeleteGroup = groupCode => dispatch => (
  new Promise((resolve) => {
    deleteGroup(groupCode).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          dispatch(removeGroupSync(groupCode));
          dispatch(addToast(
            { id: 'app.deleted', values: { type: 'group', code: groupCode } },
            TOAST_SUCCESS,
          ));
          resolve();
        } else {
          dispatch(addErrors(data.errors.map(err => err.message)));
          data.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
          resolve();
        }
      });
    }).catch(() => {});
  })
);

export const setReferences = references => ({
  type: SET_REFERENCES,
  payload: {
    references,
  },
});

export const fetchReferences = (referenceKey, groupname, page = { page: 1, pageSize: 10 }) =>
  dispatch => (
    new Promise((resolve) => {
      dispatch(toggleLoading('references'));
      getReferences(page, groupname, referenceKey).then((response) => {
        response.json().then((json) => {
          if (response.ok) {
            dispatch(setReferences({
              [referenceKey]: json.payload,
            }));
            dispatch(setPage(json.metaData));
          } else {
            dispatch(addErrors(json.errors.map(err => err.message)));
            json.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
          }
          dispatch(toggleLoading('references'));
          resolve();
        });
      }).catch(() => {});
    })
  );

export const fetchCurrentPageGroupDetail = groupname => (dispatch, getState) => (
  new Promise((resolve) => {
    getGroup(groupname).then((response) => {
      response.json().then((json) => {
        if (response.ok) {
          dispatch(setSelectedGroup(json.payload));
          const references = getReferenceKeyList(getState());
          references.forEach((referenceKey) => {
            if (getSelectedRefs(getState())[referenceKey]) {
              dispatch(fetchReferences(referenceKey, groupname));
            } else {
              setReferences({
                [referenceKey]: [],
              });
            }
          });
        } else {
          dispatch(addErrors(json.errors.map(err => err.message)));
          json.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
        }
        resolve();
      });
    }).catch(() => {});
  })
);

export const fetchAllGroupEntries = (page = { page: 1, pageSize: 10 }, params = '') => dispatch => new Promise((resolve) => {
  dispatch(toggleLoading('groups'));
  getGroups(page, params).then((response) => {
    response.json().then((data) => {
      if (response.ok) {
        dispatch(setGroupEntries(data.payload));
        dispatch(toggleLoading('groups'));
        dispatch(setPage(data.metaData));
        resolve();
      } else {
        dispatch(addErrors(data.errors.map(err => err.message)));
        data.errors.forEach(err => dispatch(addToast(err.message, TOAST_ERROR)));
        dispatch(toggleLoading('groups'));
        resolve();
      }
    });
  }).catch(() => {});
});
