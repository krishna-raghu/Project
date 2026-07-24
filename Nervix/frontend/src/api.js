import axios from 'axios';
import { supabase } from './supabaseClient';

const API_ROOT = 'http://localhost:8080/api/v1';
const api = axios.create({ baseURL: API_ROOT });
let currentUserSubject;
let currentUserRequest;
let currentUserBootstrapRequest;

export const resetCurrentUserCache = () => {
  currentUserSubject = undefined;
  currentUserRequest = undefined;
  currentUserBootstrapRequest = undefined;
};

const axiosResponse = (config, data, status = 200) => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Created',
  headers: {},
  config,
});

// Compatibility bridge for the existing Login, Signup and App components.
// It preserves their UI while routing authentication through the Supabase
// session required by the Spring resource server.
axios.interceptors.request.use(async (config) => {
  const url = config.url || '';
  if (url.endsWith('/auth/login')) {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    config.adapter = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });
      if (error) throw error;
      return axiosResponse(config, {
        message: 'LOGIN_SUCCESS',
        token: data.session.access_token,
      });
    };
  } else if (url.endsWith('/auth/signup') || url.endsWith('/auth/oauth-signup')) {
    config.adapter = async () => axiosResponse(config, { message: 'PROFILE_PROVISIONED_BY_API' }, 201);
  } else if (url.includes('/auth/user/')) {
    config.adapter = async () => {
      const response = await api.get('/users/me');
      return axiosResponse(config, response.data.data);
    };
  }
  return config;
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Your session has expired. Please sign in again.');
  }
  config.headers.Authorization = `Bearer ${session.access_token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.status === 401
      ? 'Your session is not valid. Please sign out and sign in again.'
      : error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  },
);

const payload = (response) => response.data.data;
const projectsPath = (workspaceId) => `/workspaces/${workspaceId}/projects`;

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const subject = session?.user?.id;
  if (!subject) throw new Error('Your session has expired. Please sign in again.');

  if (currentUserSubject !== subject) {
    currentUserSubject = subject;
    currentUserRequest = undefined;
    currentUserBootstrapRequest = undefined;
  }

  if (!currentUserRequest) {
    currentUserRequest = api.get('/users/me')
      .then(payload)
      .catch((error) => {
        currentUserRequest = undefined;
        throw error;
      });
  }
  return currentUserRequest;
};
export const listProjects = async (workspaceId) => payload(await api.get(projectsPath(workspaceId)));
export const createProject = async (workspaceId, body) => payload(await api.post(projectsPath(workspaceId), body));
export const updateProject = async (workspaceId, projectId, body) =>
  payload(await api.put(`${projectsPath(workspaceId)}/${projectId}`, body));
export const deleteProject = async (workspaceId, projectId) =>
  api.delete(`${projectsPath(workspaceId)}/${projectId}`);
export const listProjectMembers = async (workspaceId, projectId) =>
  payload(await api.get(`${projectsPath(workspaceId)}/${projectId}/members`));
export const getProjectTeam = async (workspaceId, projectId) =>
  payload(await api.get(`${projectsPath(workspaceId)}/${projectId}/team`));
export const changeProjectMemberRole = async (workspaceId, projectId, userId, role) =>
  payload(await api.put(`${projectsPath(workspaceId)}/${projectId}/members/${userId}/role`, { role }));
export const removeProjectMember = async (workspaceId, projectId, userId) =>
  api.delete(`${projectsPath(workspaceId)}/${projectId}/team/members/${userId}`);
export const createProjectInvitation = async (workspaceId, projectId, body) =>
  payload(await api.post(`${projectsPath(workspaceId)}/${projectId}/invitations`, body));
export const revokeProjectInvitation = async (workspaceId, projectId, invitationId) =>
  api.delete(`${projectsPath(workspaceId)}/${projectId}/invitations/${invitationId}`);
export const claimMyInvitations = async () =>
  payload(await api.post('/invitations/me/claim'));

export const bootstrapCurrentUser = async () => {
  const profile = await getCurrentUser();
  if (!currentUserBootstrapRequest) {
    currentUserBootstrapRequest = claimMyInvitations()
      .then(() => profile)
      .catch((error) => {
        currentUserBootstrapRequest = undefined;
        throw error;
      });
  }
  return currentUserBootstrapRequest;
};
