import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';
import UserTableFiltersResult from 'src/sections/user/user-table-filters-result';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/me',
    login: '/login',
    register: '/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {   
    list: '/blogs',
    filterList: (filter) => `/blogs?filter=${filter}`,
    details: (slug) => `/blogs/slug/${slug}`,
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },

  plan: {
    list: '/plans',
    filterList: (filter) => `/plans?filter=${filter}`,
    details: (id) => `/plans/${id}`,
  },

  dashboard:{
    count:'/analytics/cards',
  },

  subscriptions: {
    list: '/subscriptions',
    filterList: (filter) => `/subscriptions?filter=${filter}`,
    details: (id) => `/subscriptions/${id}`,
  },

  email: {
    list: '/wait-lists',
    filterList: (filter) => `/wait-lists?${filter}`,
    details: (id) => `/wait-lists/${id}`,
  },
    category: {
    list: '/categories',
    filterList: (filter) => `/categories?${filter}`,
    details: (id) => `/categories/${id}`,
  },
  contact: {
    list: '/contact-uses',
    filterList: (filter) => `/contact-uses?${filter}`,
    details: (id) => `/contact-uses/${id}`,
  },
  user: {
    list: '/api/users/list',
    filterList: (filter) => `/api/users/list?${filter}`,
    details: (id) => `/api/users/${id}`, // patch
    search: '/api/user/search',
    delete: (id) => `/user/${id}`,
    events:(userId)=>`/user/events/${userId}`
  },
  resume: {
    details:(userId)=>`/resumes/resume-by-id/${userId}`
  },
  comments: {
    list: '/comments',
    filterList: (filter) => `/comments/${filter}`,
  details: (blogId) => `/comments/${ blogId }`,
},
  jobs:{
   list: '/jobs',
    filterList: (filter) => `/jobs?filter=${filter}`,
  details: (id) => `/jobs/${ id }`,
  }

};