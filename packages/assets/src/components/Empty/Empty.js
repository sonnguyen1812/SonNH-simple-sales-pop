import {LegacyCard, EmptyState} from '@shopify/polaris';
import React from 'react';

export default function Empty() {
  return (
    <LegacyCard sectioned>
      <EmptyState
        heading="No data here"
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p></p>
      </EmptyState>
    </LegacyCard>
  );
}
