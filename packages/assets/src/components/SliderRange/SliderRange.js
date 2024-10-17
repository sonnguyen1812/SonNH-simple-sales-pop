import './SliderRange.scss';

import {RangeSlider, Text} from '@shopify/polaris';

import React from 'react';

const SliderRange = ({label, min, max, helpText, rangeValue, handleRangeSliderChange, unit}) => {
  return (
    <RangeSlider
      output
      label={label}
      min={min}
      max={max}
      helpText={helpText}
      value={rangeValue}
      onChange={handleRangeSliderChange}
      suffix={
        <div className="SliderRange__suffix">
          <span className="SliderRange__value">{rangeValue}</span>
          <Text variant="bodyXs" as="span">
            {unit}(s)
          </Text>
        </div>
      }
    />
  );
};

export default SliderRange;
