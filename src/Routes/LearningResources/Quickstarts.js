import React from 'react';
import {
  QuickStartTile,
  QuickStartCatalogSection,
} from '@patternfly/quickstarts';
import {
  Gallery,
  GalleryItem,
  TextContent,
  Text,
} from '@patternfly/react-core';
import { BookIcon } from '@patternfly/react-icons';

const quickstarts = [
  {
    apiVersion: '5',
    kind: 'documentation',
    metadata: {
      name: 'name',
    },
    spec: {
      displayName: 'Build and register RHEL for Edge images',
      icon: <BookIcon />,
      description:
        'With the edge management application, you can create an image and manage the packages associated with an image. You can build an image, download it, install it on a node, and then register that node so it can receive updates.',
      link: {
        href: 'https://console.redhat.com/application-services/learning-resources',
      },
      type: { text: 'Documentation', color: 'orange' },
    },
  },
  {
    apiVersion: '5',
    kind: 'documentation',
    metadata: {
      name: 'name',
    },
    spec: {
      displayName: 'Working with systems',
      icon: <BookIcon />,
      description:
        'Group, connect, and manage edge systems after registering them with the edge management console.',
      type: { text: 'Documentation', color: 'orange' },
    },
  },
];

const App = () => {
  return (
    <QuickStartCatalogSection>
      <TextContent className="pf-u-mb-md">
        <Text component="h2">Documentation</Text>
        <Text component="p" className="catalog-sub">
          Technical information for using the service
        </Text>
      </TextContent>
      <Gallery className="pfext-quick-start-catalog__gallery" hasGutter>
        {quickstarts.map((quickStart, index) => {
          return (
            <GalleryItem
              key={index}
              className="pfext-quick-start-catalog__gallery-item"
            >
              <QuickStartTile quickStart={quickStart} />
            </GalleryItem>
          );
        })}
      </Gallery>
    </QuickStartCatalogSection>
  );
};

export default App;
