import './DesktopPositionInput.scss';

import {Labelled, LegacyStack, Text} from '@shopify/polaris';

import PropTypes from 'prop-types';
import React from 'react';

const defaultOptions = [
  {label: 'Bottom left', value: 'bottom-left'},
  {label: 'Bottom right', value: 'bottom-right'},
  {label: 'Top left', value: 'top-left'},
  {label: 'Top right', value: 'top-right'}
];

const DesktopPositionInput = ({label, value, onChange, helpText, options = defaultOptions}) => {
  options = options || defaultOptions;
  const optionElements = options.map((option, index) => (
    <div
      key={index}
      className={`Avada-DesktopPosition ${
        value === option.value ? 'Avada-DesktopPosition--selected' : ''
      }`}
      onClick={() => onChange(option.value)}
    >
      <div
        className={`Avada-DesktopPosition__Input Avada-DesktopPosition__Input--${option.value}`}
      />
    </div>
  ));
  return (
    <Labelled label={label}>
      <LegacyStack>{optionElements}</LegacyStack>
      <Text variant="bodyLg" as="p" tone={'subdued'}>
        {helpText}
      </Text>
    </Labelled>
  );
};

DesktopPositionInput.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  helpText: PropTypes.string
};

export default DesktopPositionInput;
