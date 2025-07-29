import React from 'react'
import { Helmet } from 'react-helmet-async'
import ServiceListView from 'src/sections/plan/view/service-list-view';

export default function ServiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Products: Service List</title>
      </Helmet>
      <ServiceListView/>
    </>
  );
}
