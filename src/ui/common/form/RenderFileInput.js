import React from 'react';
import PropTypes from 'prop-types';
import { Col, ControlLabel } from 'patternfly-react';

const RenderFileInput = ({
  input: { name, onChange, onBlur },
  append, label, labelSize, placeholder, meta: { touched, error },
  help, disabled, acceptFile,
}) => (
  <div className={(touched && error) ? 'text-right form-group has-error' : 'text-right form-group'}>
    <Col xs={labelSize}>
      <ControlLabel htmlFor={name}>
        {label} {help}
      </ControlLabel>
    </Col>
    <Col xs={12 - labelSize}>
      <input
        name={name}
        type="file"
        accept={acceptFile}
        multiple
        onBlur={e => onBlur({ files: Object.values(e.target.files) })}
        onChange={e => onChange({ files: Object.values(e.target.files) })}
        placeholder={placeholder}
        className="form-control RenderFileInput"
        disabled={disabled}
      />
      {append && <span className="AppendedLabel">{append}</span>}
      {touched && ((error && <span className="help-block">{error}</span>))}
    </Col>
  </div>
);

RenderFileInput.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  label: PropTypes.node,
  placeholder: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  help: PropTypes.node,
  disabled: PropTypes.bool,
  labelSize: PropTypes.number,
  append: PropTypes.string,
  acceptFile: PropTypes.string,

};

RenderFileInput.defaultProps = {
  input: {},
  label: '',
  placeholder: '',
  meta: {},
  help: null,
  disabled: false,
  labelSize: 2,
  append: '',
  acceptFile: '',
};
export default RenderFileInput;
