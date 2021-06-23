import React, { useEffect, useState } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Bullseye,
  Spinner,
  Stack,
  StackItem,
  Flex,
  FlexItem,
  Grid,
  GridItem
} from '@patternfly/react-core';
import CheckCircle from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import InfoCircle from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import ExclamationCircle from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ExclamationTriangle from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

const getIcon = status => {
  if (status === "Success") {
    return <CheckCircle style={{fill: "green"}} />
  } else if (status === "Info") {
    return <InfoCircle style={{fill: "blue"}} />
  } else if (status === "Warning") {
    return <ExclamationTriangle style={{fill: "orange"}} />
  } else if (status === "Danger") {
    return <ExclamationCircle style={{fill: "red"}} />
  }
}

const LastCanariesTileBase = ({ data }) => {
  return (
  <Card className="tiles-card">
    <CardTitle>Recent Canaries</CardTitle>
    <CardBody>
      <Stack hasGutter >
        {data.map((canary) =>
          <StackItem>
            <Grid hasGutter >
              <GridItem span={5} >
                <Button variant="link" isInline >{canary.name}</Button>
              </GridItem>
              <GridItem span={6} >
                  {canary.lastRanDate}
              </GridItem>
              <GridItem span={1} >
                  {getIcon(canary.status)}
              </GridItem>
            </Grid> 
          </StackItem>
        )}
      </Stack>
    </CardBody>
  </Card>
  )
};

LastCanariesTileBase.propTypes = {
  name: PropTypes.string,
  status: PropTypes.string,
  lastRanDate: PropTypes.string
};

const canariesMockData = [
  {
      name: "Sensors",
      status: "Danger",
      lastRanDate: "Jun 02 2021"
  },
  {
      name: "Sensors",
      status: "Warning",
      lastRanDate: "Jun 01 2021"
  },
  {
      name: "Sensors",
      status: "Success",
      lastRanDate: "Jun 05 2021"
  },
  {
      name: "Scanners",
      status: "Info",
      lastRanDate: "Jun 03 2021"
  },
  {
      name: "Kiosks",
      status: "Danger",
      lastRanDate: "Jun 03 2021"
  },
  {
      name: "Antenna",
      status: "Warning",
      lastRanDate: "Jun 03 2021"
  }
]

const LastCanariesTile = () => {
  const { isLoading, hasError, data } = useSelector(
    ({ canariesInfoReducer }) => ({
      isLoading:
      false,
      // canariesInfoReducer?.isLoading !== undefined
      //   ? canariesInfoReducer?.isLoading
      //   : true,
      hasError: false, //canariesInfoReducer?.hasError || false,
      data: canariesMockData //canariesInfoReducer?.data || null,
    }),
    shallowEqual
  );

  if (isLoading) {
    return (
      <Card className="tiles-card">
        <CardTitle>Recent Canaries</CardTitle>
        <CardBody>
          <Bullseye>
            <Spinner />
          </Bullseye>
        </CardBody>
      </Card>
    );
  }
  if (hasError) {
    return (
      <Card className="tiles-card">
        <CardTitle>Recent Canaries</CardTitle>
        <CardBody>{data}</CardBody>
      </Card>
    );
  }
  return (
    <LastCanariesTileBase
      data={data.slice(-5)}
    />
  );
};

export default LastCanariesTile;
