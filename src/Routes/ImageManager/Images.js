import React, { Fragment, useState, Suspense } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Spinner, Bullseye } from '@patternfly/react-core';
import { useHistory, useLocation, useNavigate } from 'react-router-dom';
import ImageSetsTable from './ImageSetsTable';
import { stateToUrlSearch } from '../../utils';
import { getImageSets } from '../../api/images';
import useApi from '../../hooks/useApi';
import PropTypes from 'prop-types';

const CreateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "CreateImageWizard" */ '../ImageManager/CreateImageWizard'
  )
);

const UpdateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "UpdateImageWizard" */ '../ImageManager/UpdateImageWizard'
  )
);

const Images = ({
  historyProp,
  locationProp,
  navigateProp,
  notificationProp,
}) => {
  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const navigate = navigateProp
    ? navigateProp()
    : useNavigate
    ? useNavigate()
    : null;
  const { pathname, search } = locationProp ? locationProp() : useLocation();

  const [response, fetchImageSets] = useApi({
    api: getImageSets,
    tableReload: true,
  });

  const { data, isLoading, hasError } = response;

  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [UpdateWizard, setUpdateWizard] = useState({
    isOpen: false,
    imageId: null,
  });
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);

  const createHistoryObj = {
    pathname,
    search: stateToUrlSearch('create_image=true', true, search),
  };
  const updateHistoryObj = {
    pathname,
    search: stateToUrlSearch('update_image=true', true, search),
  };

  const openCreateWizard = () => {
    if (navigateProp) {
      navigate({ ...createHistoryObj, replace: true });
    } else {
      history.push({ ...createHistoryObj });
    }
    setIsCreateWizardOpen(true);
  };

  const openUpdateWizard = (id) => {
    if (navigateProp) {
      navigate({ ...updateHistoryObj, replace: true });
    } else {
      history.push({ ...updateHistoryObj });
    }

    setUpdateWizard({
      isOpen: true,
      imageId: id,
    });
  };

  const reload = async () => {
    await fetchImageSets();
    setHasModalSubmitted(true);
  };

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Images" />
      </PageHeader>
      <section className="edge-images pf-l-page__main-section pf-c-page__main-section">
        <ImageSetsTable
          historyProp={historyProp}
          locationProp={locationProp}
          navigateProp={navigateProp}
          data={data?.data || []}
          count={data?.count}
          isLoading={isLoading}
          hasError={hasError}
          fetchImageSets={fetchImageSets}
          openCreateWizard={openCreateWizard}
          openUpdateWizard={openUpdateWizard}
          hasModalSubmitted={hasModalSubmitted}
          setHasModalSubmitted={setHasModalSubmitted}
        />
      </section>
      {isCreateWizardOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <CreateImageWizard
            navigateBack={() => {
              if (navigateProp) {
                navigate({ ...createHistoryObj, replace: true });
              } else {
                history.push({
                  pathname,
                  search: stateToUrlSearch('create_image=true', false, search),
                });
              }
              setIsCreateWizardOpen(false);
            }}
            reload={reload}
            notificationProp={notificationProp}
          />
        </Suspense>
      )}
      {UpdateWizard.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateImageWizard
            navigateBack={() => {
              if (navigateProp) {
                navigate({ ...updateHistoryObj, replace: true });
              } else {
                history.push({
                  pathname,
                  search: stateToUrlSearch('update_image=true', false, search),
                });
              }
              setUpdateWizard((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            reload={reload}
            updateImageID={UpdateWizard.imageId}
            notificationProp={notificationProp}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

Images.propTypes = {
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  navigateProp: PropTypes.func,
  notificationProp: PropTypes.object,
};
export default Images;
