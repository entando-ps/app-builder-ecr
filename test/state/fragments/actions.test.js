import { isFSA } from 'flux-standard-action';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialize } from 'redux-form';
import { config } from '@entando/apimanager';
import { ADD_ERRORS, ADD_TOAST } from '@entando/messages';

import { mockApi } from 'test/testUtils';
import { history, ROUTE_FRAGMENT_LIST } from 'app-init/router';
import {
  fetchFragment, fetchFragmentDetail, setFragments, fetchFragments,
  fetchPlugins, setPlugins, setSelectedFragment, fetchFragmentSettings,
  updateFragmentSettings, removeFragment, sendDeleteFragment,
  sendPostFragment, sendPutFragment, setFilters,
} from 'state/fragments/actions';
import {
  PLUGINS_OK,
  GET_FRAGMENT_OK,
  LIST_FRAGMENTS_OK,
  FILTERS_OK,
} from 'test/mocks/fragments';

import {
  getFragmentSettings,
  putFragmentSettings,
  getFragment,
  getFragments,
  deleteFragment,
  postFragment,
  putFragment,
} from 'api/fragments';

import { SET_SELECTED, SET_PLUGINS, SET_FRAGMENTS, SET_FILTERS, REMOVE_FRAGMENT } from 'state/fragments/types';
import { TOGGLE_LOADING } from 'state/loading/types';
import { SET_PAGE } from 'state/pagination/types';
import { CONTINUE_SAVE_TYPE } from 'state/fragments/const';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

config(mockStore({ api: { useMocks: true }, currentUser: { token: 'asdf' } }));

jest.mock('app-init/router', () => ({
  history: {
    push: jest.fn(),
  },
  ROUTE_FRAGMENT_EDIT: '/fragment/edit/:fragmentCode',
}));

const GET_FRAGMENT_PAYLOAD = GET_FRAGMENT_OK.payload;
const PLUGINS_PAYLOAD = PLUGINS_OK;

const FRAGMENT_CODE = 'myCode';
const FRAGMENT_SETTINGS = { enableEditingWhenEmptyDefaultGui: true };

const INITIAL_STATE = {
  form: {},
  fragments: {
    list: [],
    widgetTypes: [],
    plugins: [],
  },
};


describe('state/fragments/actions', () => {
  let store;
  let action;

  beforeEach(() => {
    store = mockStore(INITIAL_STATE);
    jest.clearAllMocks();
    store.clearActions();
  });

  describe('setFragments', () => {
    it('test setFragments action sets the correct type', () => {
      action = setFragments(LIST_FRAGMENTS_OK.payload);
      expect(action.type).toEqual(SET_FRAGMENTS);
    });
  });

  describe('setFilters', () => {
    it('test setFilters action sets the correct type', () => {
      action = setFilters(FILTERS_OK);
      expect(action.type).toEqual(SET_FILTERS);
    });
  });

  describe('fetchFragments', () => {
    beforeEach(() => {
      getFragments.mockImplementation(mockApi({ payload: LIST_FRAGMENTS_OK }));
    });
    it('fetchFragments calls setFragments and setPage actions', (done) => {
      store.dispatch(fetchFragments()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(4);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(SET_FRAGMENTS);
        expect(actions[2].type).toEqual(TOGGLE_LOADING);
        expect(actions[3].type).toEqual(SET_PAGE);
        done();
      }).catch(done.fail);
    });

    it('fetchFragments as error and dispatch ADD_ERRORS ', (done) => {
      getFragments.mockImplementation(mockApi({ errors: true }));
      store.dispatch(fetchFragments()).then(() => {
        const actions = store.getActions();
        expect(actions).toHaveLength(4);
        expect(actions[0].type).toEqual(TOGGLE_LOADING);
        expect(actions[1].type).toEqual(ADD_ERRORS);
        expect(actions[2].type).toEqual(ADD_TOAST);
        expect(actions[3].type).toEqual(TOGGLE_LOADING);

        done();
      }).catch(done.fail);
    });

    it('fragments is defined and properly valued', (done) => {
      store.dispatch(fetchFragments()).then(() => {
        const actionPayload = store.getActions()[1].payload;
        expect(actionPayload.fragments).toHaveLength(7);
        const fragment = actionPayload.fragments[0];
        expect(fragment).toHaveProperty('code', 'myCode');
        expect(fragment).toHaveProperty('isLocked');
        expect(fragment).toHaveProperty('widgetType');
        expect(fragment).toHaveProperty('pluginCode');
        done();
      }).catch(done.fail);
    });
  });

  describe('test sync actions', () => {
    describe('test setPlugins', () => {
      it('action payload contains plugins list', () => {
        action = setPlugins(PLUGINS_PAYLOAD);
        expect(action.type).toBe(SET_PLUGINS);
        expect(action.payload.plugins).toEqual(PLUGINS_PAYLOAD);
      });
    });
    describe('test setSelectedFragment', () => {
      it('action payload contains selected fragment', () => {
        action = setSelectedFragment(GET_FRAGMENT_PAYLOAD);
        expect(action.type).toBe(SET_SELECTED);
        expect(action.payload.fragment).toEqual(GET_FRAGMENT_PAYLOAD);
      });
    });

    describe('removeFragment', () => {
      beforeEach(() => {
        action = removeFragment('CODE');
      });

      it('is FSA compliant', () => {
        expect(isFSA(action)).toBe(true);
      });

      it('actions is correct setup ', () => {
        expect(action).toHaveProperty('type', REMOVE_FRAGMENT);
        expect(action).toHaveProperty('payload.fragmentCode', 'CODE');
      });
    });
  });

  describe('thunks', () => {
    describe('fetchFragment', () => {
      beforeEach(() => {
        getFragment.mockImplementation(mockApi({ payload: GET_FRAGMENT_OK }));
      });

      it('if API response ok, initializes fragment information', (done) => {
        store.dispatch(fetchFragment(FRAGMENT_CODE)).then(() => {
          const actions = store.getActions();
          expect(actions).toHaveLength(1);
          expect(actions[0]).toHaveProperty('type', SET_SELECTED);
          done();
        }).catch(done.fail);
      });

      it('if API response is not ok, dispatch ADD_ERRORS', (done) => {
        getFragment.mockImplementation(mockApi({ errors: true }));
        store.dispatch(fetchFragment(FRAGMENT_CODE)).then(() => {
          expect(store.getActions()).toHaveLength(2);
          expect(store.getActions()[0]).toHaveProperty('type', ADD_ERRORS);
          expect(store.getActions()[1]).toHaveProperty('type', ADD_TOAST);
          done();
        }).catch(done.fail);
      });
    });

    describe('fetchFragmentDetail', () => {
      it('action payload contains fragment information', (done) => {
        store.dispatch(fetchFragmentDetail(FRAGMENT_CODE)).then(() => {
          const actions = store.getActions();
          expect(actions[0].payload.fragment).toEqual(GET_FRAGMENT_PAYLOAD);
          done();
        }).catch(done.fail);
      });

      it('action payload contains fragment information', (done) => {
        store.dispatch(fetchFragmentDetail(FRAGMENT_CODE)).then(() => {
          const actions = store.getActions();
          expect(actions[0].payload.fragment).toEqual(GET_FRAGMENT_PAYLOAD);
          done();
        }).catch(done.fail);
      });
    });

    describe('fetchPlugins', () => {
      it('action payload contains plugins list', (done) => {
        store.dispatch(fetchPlugins()).then(() => {
          const actions = store.getActions();
          expect(actions[0]).toHaveProperty('type', SET_PLUGINS);
          expect(actions[0]).toHaveProperty('payload.plugins', [{ code: 'pluginCode', title: 'pluginCode' }]);
          done();
        }).catch(done.fail);
      });
    });

    describe('fetchFragmentSettings', () => {
      it('if API response is ok, initializes the form with fragmentSettings information', (done) => {
        store.dispatch(fetchFragmentSettings()).then(() => {
          expect(initialize).toHaveBeenCalled();
          done();
        }).catch(done.fail);
      });

      it('if API response is not ok, dispatch ADD_ERRORS', (done) => {
        getFragmentSettings.mockImplementation(mockApi({ errors: true }));
        store.dispatch(fetchFragmentSettings()).then(() => {
          expect(store.getActions()).toHaveLength(2);
          expect(store.getActions()[0]).toHaveProperty('type', ADD_ERRORS);
          expect(store.getActions()[1]).toHaveProperty('type', ADD_TOAST);
          done();
        }).catch(done.fail);
      });
    });

    describe('updateFragmentSettings', () => {
      beforeEach(() => {
        putFragmentSettings.mockImplementation(mockApi({ payload: FRAGMENT_SETTINGS }));
      });

      it('action payload contains fragment settings information', (done) => {
        store.dispatch(updateFragmentSettings(FRAGMENT_SETTINGS)).then(() => {
          const actions = store.getActions();
          expect(initialize).toHaveBeenCalled();
          expect(actions).toHaveLength(2);
          expect(actions[0]).toHaveProperty('payload', FRAGMENT_SETTINGS);
          expect(actions[1]).toHaveProperty('type', ADD_TOAST);
          done();
        }).catch(done.fail);
      });

      it('if API response ok, initializes the form with reponse data information', (done) => {
        store.dispatch(updateFragmentSettings(FRAGMENT_SETTINGS)).then(() => {
          expect(initialize).toHaveBeenCalledWith('fragmentSettings', FRAGMENT_SETTINGS);
          done();
        }).catch(done.fail);
      });

      it('if API response is not ok, dispatch ADD_ERRORS', (done) => {
        putFragmentSettings.mockImplementation(mockApi({ errors: true }));
        store.dispatch(updateFragmentSettings()).then(() => {
          const actions = store.getActions();
          expect(actions).toHaveLength(2);
          expect(actions[0]).toHaveProperty('type', ADD_ERRORS);
          expect(actions[1]).toHaveProperty('type', ADD_TOAST);
          done();
        }).catch(done.fail);
      });
    });
    describe('sendDeleteFragment', () => {
      it('calls deleteFragment and dispatch action REMOVE_FRAGMENT', (done) => {
        store.dispatch(sendDeleteFragment('CODE')).then(() => {
          expect(deleteFragment).toHaveBeenCalled();
          const actions = store.getActions();
          expect(actions).toHaveLength(2);
          expect(actions[0]).toHaveProperty('type', REMOVE_FRAGMENT);
          expect(actions[1]).toHaveProperty('type', ADD_TOAST);
          done();
        }).catch(done.fail);
      });

      it('if API response is not ok, dispatch ADD_ERRORS', (done) => {
        deleteFragment.mockImplementation(mockApi({ errors: true }));
        store.dispatch(sendDeleteFragment()).then(() => {
          expect(deleteFragment).toHaveBeenCalled();
          const actions = store.getActions();
          expect(actions).toHaveLength(2);
          expect(actions[0]).toHaveProperty('type', ADD_ERRORS);
          expect(actions[1]).toHaveProperty('type', ADD_TOAST);
          done();
        }).catch(done.fail);
      });
    });
    describe('sendPostFragment', () => {
      it('calls postFragment and router', () => {
        store.dispatch(sendPostFragment(GET_FRAGMENT_OK)).then(() => {
          expect(postFragment).toHaveBeenCalled();
          expect(history.push).toHaveBeenCalledWith(ROUTE_FRAGMENT_LIST);
        });
      });
      it('calls postFragment without routing', () => {
        store.dispatch(sendPostFragment(GET_FRAGMENT_OK, CONTINUE_SAVE_TYPE)).then(() => {
          expect(postFragment).toHaveBeenCalled();
        });
      });

      it('if the response is not ok, dispatch add errors', async () => {
        postFragment.mockImplementationOnce(mockApi({ errors: true }));
        return store.dispatch(sendPostFragment(GET_FRAGMENT_OK)).catch((e) => {
          expect(postFragment).toHaveBeenCalled();
          const actions = store.getActions();
          expect(actions).toHaveLength(1);
          expect(actions[0]).toHaveProperty('type', ADD_ERRORS);
          expect(e).toHaveProperty('errors');
          e.errors.forEach((error, index) => {
            expect(error.message).toEqual(actions[0].payload.errors[index]);
          });
        });
      });
    });
    describe('sendPutFragment', () => {
      it('calls putFragment and router', () => {
        store.dispatch(sendPutFragment(GET_FRAGMENT_OK)).then(() => {
          expect(putFragment).toHaveBeenCalled();
          expect(history.push).toHaveBeenCalledWith(ROUTE_FRAGMENT_LIST);
        });
      });

      it('calls putFragment without routing', () => {
        store.dispatch(sendPutFragment(GET_FRAGMENT_OK, CONTINUE_SAVE_TYPE)).then(() => {
          expect(putFragment).toHaveBeenCalled();
        });
      });

      it('if the response is not ok, dispatch add errors', async () => {
        putFragment.mockImplementationOnce(mockApi({ errors: true }));
        return store.dispatch(sendPutFragment(GET_FRAGMENT_OK)).catch((e) => {
          expect(putFragment).toHaveBeenCalled();
          const actions = store.getActions();
          expect(actions).toHaveLength(1);
          expect(actions[0]).toHaveProperty('type', ADD_ERRORS);
          expect(e).toHaveProperty('errors');
          e.errors.forEach((error, index) => {
            expect(error.message).toEqual(actions[0].payload.errors[index]);
          });
        });
      });
    });
  });
});
