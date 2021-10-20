import React from 'react';
import GeneralTable from '../../components/GeneralTable';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { Text } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import { composeStatus } from '../ImageManagerDetail/constants';
import {
  imageTypeMapper,
  distributionMapper,
} from '../ImageManagerDetail/constants';
import { loadEdgeImages } from '../../store/actions';

const defaultFilters = {
  name: {
    label: 'Name',
    key: 'name',
    value: '',
    type: 'text',
  },
  distribution: {
    label: 'Distribution',
    key: 'distribution',
    value: [],
    type: 'checkbox',
    items: Object.entries(distributionMapper).map(([value, label]) => ({
      label,
      value,
    })),
  },
  status: {
    label: 'Status',
    key: 'status',
    value: [],
    type: 'checkbox',
    items: composeStatus.map((item) => ({
      label: item,
      value: item,
    })),
  },
};

const columnNames = [
  { title: 'Name', type: 'name', sort: true },
  { title: 'Version', type: 'version', sort: false },
  { title: 'Distribution', type: 'distribution', sort: true },
  { title: 'Type', type: 'image_type', sort: false },
  { title: 'Created', type: 'created_at', sort: true },
  { title: 'Status', type: 'status', sort: true },
];

const createRows = (data) => {
  return data.map((image) => ({
    id: image.ID,
    cells: [
      {
        title: (
          <Link to={`${paths['manage-images']}/${image.ID}`}>{image.Name}</Link>
        ),
      },
      image?.Version,
      {
        title: distributionMapper[image?.Distribution],
      },
      {
        title: imageTypeMapper[image?.ImageType],
      },
      {
        title: <DateFormat date={image?.CreatedAt} />,
      },
      {
        title: <StatusLabel status={image?.Status} />,
      },
    ],
    imageStatus: image?.Status,
    isoURL: image?.Installer?.ImageBuildISOURL,
  }));
};

const ImageTable = ({ openCreateWizard, openUpdateWizard }) => {
  const { count, data, isLoading, hasError } = useSelector(
    ({ edgeImagesReducer }) => ({
      count: edgeImagesReducer?.data?.count,
      data: edgeImagesReducer?.data?.data || null,
      isLoading:
        edgeImagesReducer?.isLoading === undefined
          ? true
          : edgeImagesReducer.isLoading,
      hasError: edgeImagesReducer?.hasError,
    }),
    shallowEqual
  );

  const actionResolver = (rowData) => {
    const actionsArray = [];
    if (rowData?.isoURL) {
      actionsArray.push({
        title: (
          <Text
            className="force-text-black remove-underline"
            component="a"
            href={rowData.isoURL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Download
          </Text>
        ),
      });
    }

    if (rowData?.imageStatus === 'SUCCESS') {
      actionsArray.push({
        title: 'Update Image',
        onClick: (_event, _rowId, rowData) => {
          openUpdateWizard(rowData.id);
        },
      });
    }

    if (rowData?.imageStatus !== 'SUCCESS') {
      actionsArray.push({
        title: '',
      });
    }

    return actionsArray;
  };

  const areActionsDisabled = (rowData) => rowData?.imageStatus !== 'SUCCESS';

  return (
    <GeneralTable
      tableData={{ count, data, isLoading, hasError }}
      columnNames={columnNames}
      createRows={createRows}
      emptyStateMessage="No images found"
      emptyStateActionMessage="Create new image"
      emptyStateAction={openCreateWizard}
      defaultSort={{ index: 4, direction: 'desc' }}
      loadTableData={loadEdgeImages}
      actionResolver={actionResolver}
      areActionsDisabled={areActionsDisabled}
      defaultFilters={defaultFilters}
      perPage={100}
    />
  );
};

ImageTable.propTypes = {
  clearFilters: PropTypes.func.isRequired,
  openCreateWizard: PropTypes.func.isRequired,
  openUpdateWizard: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
};

export default ImageTable;
