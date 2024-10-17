import {TextField} from '@shopify/polaris';
import React from 'react';

export default function PageInput({
  label, value, handleChange, line
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      multiline={line}
      autoComplete="off"
      helpText="Page URLs NOT to show the pop-up (separated by new lines)"
    />
  );
}
