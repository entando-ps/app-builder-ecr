import {
  PLUGIN_OK,
  PLUGINS_OK,
} from 'test/mocks/plugins';
import { makeMockRequest, makeRequest, METHODS } from '@entando/apimanager';

export const getPlugins = (params, page) => (
  makeRequest(
    {
      uri: `/plugins/info${params || ''}`,
      domain: '/digital-exchange',
      method: METHODS.GET,
      mockResponse: PLUGINS_OK,
      useAuthentication: true,
    },
    page,
  )
);

export const getPlugin = id => makeMockRequest({
  uri: `/api/plugins/${id}`,
  method: METHODS.GET,
  mockResponse: PLUGIN_OK,
  useAuthentication: true,
});

export const putPluginConfig = plugin => (
  makeMockRequest({
    uri: `/api/plugins/config/${plugin.id}`,
    method: METHODS.PUT,
    mockResponse: PLUGIN_OK,
    body: plugin.formData,
    useAuthentication: true,
  })
);
