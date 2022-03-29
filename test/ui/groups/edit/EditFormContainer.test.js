import 'test/enzyme-init';
import { mapStateToProps, mapDispatchToProps } from 'ui/groups/edit/EditFormContainer';

jest.mock('state/groups/actions', () => ({
  sendPutGroup: jest.fn().mockReturnValue('sendPutGroup_result'),
  fetchGroup: jest.fn().mockReturnValue('fetchGroup_result'),
}));

jest.mock('state/groups/selectors', () => ({
  getSelectedGroup: jest.fn().mockReturnValue('getGroup_result'),
}));

const dispatchMock = jest.fn();

const TEST_STATE = {
  mode: 'edit',
  form: {
    group: '',
  },
  initialValues: 'getGroup_result',
};

const ownProps = {
  match: {
    params: {
      groupCode: 'group_code',
    },
  },
};

const dispatchProps = {
  history: {},
};

describe('EditFormContainer', () => {
  describe('mapStateToProps', () => {
    it('maps groupCode property state in GroupForm', () => {
      const props = mapStateToProps(TEST_STATE, ownProps);
      expect(props).toHaveProperty('mode', 'edit');
      expect(props).toHaveProperty('groupCode', 'group_code');
    });
  });

  describe('mapDispatchToProps', () => {
    let props;
    beforeEach(() => {
      props = mapDispatchToProps(dispatchMock, dispatchProps);
    });

    it('verify that the "onSubmit" is defined by and dispatch sendPutGroup', () => {
      expect(props.onSubmit).toBeDefined();
      props.onSubmit();
      expect(dispatchMock).toHaveBeenCalledWith('sendPutGroup_result');
    });

    it('verify that "onDidMount" is defined by and dispatch fetchGroup', () => {
      expect(props.onDidMount).toBeDefined();
      props.onDidMount({ groupCode: 'group_code' });
      expect(dispatchMock).toHaveBeenCalledWith('fetchGroup_result');
    });
  });
});
