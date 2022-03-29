import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Tabs, Tab, Row, Col, Alert, DropdownButton, MenuItem } from 'patternfly-react';
import { Panel } from 'react-bootstrap';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';

import {
  validateFragmentCodeField,
  formatMessageRequired,
  formatMessageMaxLength,
} from 'helpers/formikValidations';
import RenderTextInput from 'ui/common/formik-field/RenderTextInput';
import FormLabel from 'ui/common/form/FormLabel';
import ConfirmCancelModalContainer from 'ui/common/cancel-modal/ConfirmCancelModalContainer';
import {
  REGULAR_SAVE_TYPE,
  CONTINUE_SAVE_TYPE,
  FORM_MODE_ADD,
  FORM_MODE_EDIT,
  FORM_MODE_CLONE,
} from 'state/fragments/const';

export const renderDefaultGuiCodeField = (fieldProp) => {
  const { field } = fieldProp;
  if (!field.value) {
    return (
      <Alert type="info">
        <FormattedMessage id="app.alert.notAvailable" />
      </Alert>
    );
  }
  return (
    <Panel>
      <Panel.Body><pre className="PageTemplateDetailTable__template">{field.value}</pre></Panel.Body>
    </Panel>
  );
};

const defaultGuiCodeField = (
  <Field
    name="defaultGuiCode"
    component={renderDefaultGuiCodeField}
  />
);

export const renderStaticField = (fieldProps) => {
  const { field, label } = fieldProps;
  if (!field.value) {
    return null;
  }
  const fieldValue = (field.value.title) ? field.value.title : field.value.code;
  if (fieldValue === null) {
    return null;
  }

  return (
    <div className="form-group">
      <label htmlFor={field.name} className="control-label col-xs-2">
        {label}
      </label>
      <Col xs={10}>
        {fieldValue}
      </Col>
    </div>
  );
};

const msgs = defineMessages({
  codePlaceholder: {
    id: 'fragment.code.placeholder',
    defaultMessage: 'Code',
  },
  guiCode: {
    id: 'fragment.tab.guiCode',
    defaultMessage: 'GUI Code',
  },
  defaultGuiCode: {
    id: 'fragment.tab.defaultGuiCode',
    defaultMessage: 'Default GUI Code',
  },
});

export const FragmentFormBody = (props) => {
  const {
    intl, isValid, isSubmitting: submitting, mode,
    dirty, onCancel, onDiscard, onHideModal, onSubmit,
    submitForm, resetForm, values, setSubmitting,
  } = props;

  const invalid = !isValid;

  const handleSubmitClick = (submitType) => {
    submitForm();
    onSubmit(values, submitType).then((res) => {
      setSubmitting(false);
      if (!res && submitType !== CONTINUE_SAVE_TYPE) {
        resetForm();
      }
    });
  };

  const handleCancelClick = () => {
    if (dirty) {
      onCancel();
    } else {
      onDiscard();
    }
  };

  let widgetTypeField = (
    <Field
      name="widgetType"
      component={renderStaticField}
      label={<FormattedMessage id="fragment.form.edit.widgetType" />}
    />
  );

  let pluginField = (
    <Field
      name="pluginCode"
      component={renderStaticField}
      label={<FormattedMessage id="fragment.form.edit.plugin" />}
    />
  );

  if ([FORM_MODE_ADD, FORM_MODE_CLONE].includes(mode)) {
    pluginField = null;
    widgetTypeField = null;
  }

  return (
    <Form className="form-horizontal">
      <Row>
        <Col xs={12}>
          <fieldset className="no-padding">
            <legend>
              <FormattedMessage id="app.info" />
              <div className="WidgetForm__required-fields text-right">
                * <FormattedMessage id="app.fieldsRequired" />
              </div>
            </legend>
            <Field
              component={RenderTextInput}
              name="code"
              label={
                <FormLabel labelId="app.code" helpId="app.help.code" required />
              }
              placeholder={intl.formatMessage(msgs.codePlaceholder)}
              disabled={mode === FORM_MODE_EDIT}
            />
            {widgetTypeField}
            {pluginField}
          </fieldset>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs={12}>
          <fieldset className="no-padding">
            <div className="form-group">
              <span className="control-label col-xs-2" />
              <Col xs={10}>
                <Tabs id="basic-tabs" defaultActiveKey={1}>
                  <Tab eventKey={1} title={intl.formatMessage(msgs.guiCode)} >
                    <div className="tab-content margin-large-bottom ">
                      <div className="tab-pane fade in active">
                        <Field
                          name="guiCode"
                          component="textarea"
                          cols="50"
                          rows="8"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey={2} title={intl.formatMessage(msgs.defaultGuiCode)} >
                    {defaultGuiCodeField}
                  </Tab>
                </Tabs>
              </Col>
            </div>
          </fieldset>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={12}>
          <div className="FragmentForm__dropdown">
            <DropdownButton
              title={intl.formatMessage({ id: 'app.save' })}
              bsStyle="primary"
              id="saveopts"
              className="FragmentForm__saveDropdown"
            >
              <MenuItem
                id="regularSaveButton"
                eventKey={REGULAR_SAVE_TYPE}
                disabled={invalid || submitting}
                onClick={() => handleSubmitClick(REGULAR_SAVE_TYPE)}
              >
                <FormattedMessage id="app.save" />
              </MenuItem>
              <MenuItem
                id="continueSaveButton"
                eventKey={CONTINUE_SAVE_TYPE}
                disabled={invalid || submitting}
                onClick={() => (
                  handleSubmitClick(CONTINUE_SAVE_TYPE)
                )}
              >
                <FormattedMessage id="app.saveAndContinue" />
              </MenuItem>
            </DropdownButton>
          </div>
          <Button
            className="pull-right"
            bsStyle="default"
            onClick={handleCancelClick}
          >
            <FormattedMessage id="app.cancel" />
          </Button>
          <ConfirmCancelModalContainer
            contentText={intl.formatMessage({ id: 'app.confirmCancel' })}
            invalid={invalid}
            submitting={submitting}
            onSave={() => {
              onHideModal();
              handleSubmitClick(REGULAR_SAVE_TYPE);
            }}
            onDiscard={onDiscard}
          />
        </Col>
      </Row>
    </Form>
  );
};

FragmentFormBody.propTypes = {
  intl: intlShape.isRequired,
  isValid: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  mode: PropTypes.oneOf([FORM_MODE_ADD, FORM_MODE_CLONE, FORM_MODE_EDIT]),
  dirty: PropTypes.bool,
  onDiscard: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onHideModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  values: PropTypes.shape({}).isRequired,
  submitForm: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
};

FragmentFormBody.defaultProps = {
  isValid: false,
  isSubmitting: false,
  mode: FORM_MODE_ADD,
  dirty: false,
};

const FragmentForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ initialValues }) => initialValues,
  mapPropsToErrors: ({ mode }) => {
    switch (mode) {
      default:
      case FORM_MODE_ADD:
        return { code: '', guiCode: '' };
      case FORM_MODE_CLONE:
        return { code: '' };
      case FORM_MODE_EDIT:
        return {};
    }
  },
  validationSchema: ({ intl }) => (
    Yup.object().shape({
      code: Yup.string()
        .required(intl.formatMessage(formatMessageRequired))
        .max(50, intl.formatMessage(formatMessageMaxLength, { max: 50 }))
        .test(
          'validateCodeField',
          validateFragmentCodeField(intl),
        ),
      guiCode: Yup.string()
        .required(intl.formatMessage(formatMessageRequired)),
      widgetType: Yup.object().shape({
        code: Yup.string().nullable(true),
        title: Yup.string().nullable(true),
      }).nullable(true),
      pluginCode: Yup.object().shape({
        code: Yup.string(),
        title: Yup.string(),
      }).nullable(true),
    })
  ),
  handleSubmit: () => {},
  displayName: 'fragmentForm',
})(FragmentFormBody);

export default injectIntl(FragmentForm);
