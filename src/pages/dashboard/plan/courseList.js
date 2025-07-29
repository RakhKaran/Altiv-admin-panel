import React from 'react'
import { Helmet } from 'react-helmet-async'
import CourseListView from 'src/sections/plan/view/course-list-view';

export default function CourseListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Products: Course List</title>
      </Helmet>

      <CourseListView/>
    </>
  );
}
