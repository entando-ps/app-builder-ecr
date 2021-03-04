import { makeRequest, METHODS } from '@entando/apimanager';

import {
  getSMTPServerSettings,
  putSMTPServerSettings,
  postTestEmailConfig,
  postSendTestEmail,
  getEmailSenders,
  deleteEmailSender,
} from 'api/emailConfig';
import { MOCK_SMTP_SERVER_SETTINGS, MOCK_EMAIL_SENDER_LIST } from 'test/mocks/emailConfig';

jest.mock('@entando/apimanager', () => ({
  makeRequest: jest.fn(() => new Promise(resolve => resolve({}))),
  METHODS: { GET: 'GET', POST: 'POST', PUT: 'PUT' },
}));

describe('api/emailConfig', () => {
  describe('getSMTPServerSettings', () => {
    it('should return a promise', () => {
      expect(getSMTPServerSettings()).toBeInstanceOf(Promise);
    });

    it('should make a request with the correct parameters', () => {
      getSMTPServerSettings();
      expect(makeRequest).toHaveBeenCalledWith({
        uri: '/api/plugins/emailSettings/SMTPServer',
        method: METHODS.GET,
        mockResponse: MOCK_SMTP_SERVER_SETTINGS,
        useAuthentication: true,
      });
    });
  });

  describe('putSMTPServerSettings', () => {
    it('should return a promise', () => {
      expect(putSMTPServerSettings()).toBeInstanceOf(Promise);
    });

    it('should make a request with the correct parameters', () => {
      putSMTPServerSettings(MOCK_SMTP_SERVER_SETTINGS);
      expect(makeRequest).toHaveBeenCalledWith({
        uri: '/api/plugins/emailSettings/SMTPServer',
        method: METHODS.PUT,
        body: MOCK_SMTP_SERVER_SETTINGS,
        mockResponse: MOCK_SMTP_SERVER_SETTINGS,
        useAuthentication: true,
      });
    });
  });

  describe('postTestEmailConfig', () => {
    it('should return a promise', () => {
      expect(postTestEmailConfig()).toBeInstanceOf(Promise);
    });

    it('should make a request with the correct parameters', () => {
      postTestEmailConfig(MOCK_SMTP_SERVER_SETTINGS);
      expect(makeRequest).toHaveBeenCalledWith({
        uri: '/api/plugins/emailSettings/SMTPServer/testConfiguration',
        method: METHODS.POST,
        body: MOCK_SMTP_SERVER_SETTINGS,
        mockResponse: {},
        useAuthentication: true,
      });
    });
  });

  describe('postSendTestEmail', () => {
    it('should return a promise', () => {
      expect(postSendTestEmail()).toBeInstanceOf(Promise);
    });

    it('should make a request with the correct parameters', () => {
      postSendTestEmail(MOCK_SMTP_SERVER_SETTINGS);
      expect(makeRequest).toHaveBeenCalledWith({
        uri: '/api/plugins/emailSettings/SMTPServer/sendTestEmail',
        method: METHODS.POST,
        mockResponse: {},
        useAuthentication: true,
      });
    });
  });

  describe('getEmailSenders', () => {
    it('should return a promise', () => {
      expect(getEmailSenders()).toBeInstanceOf(Promise);
    });

    it('should make a request with the correct parametsrs', () => {
      getEmailSenders();
      expect(makeRequest).toHaveBeenCalledWith({
        uri: '/api/plugins/emailSettings/senders',
        method: METHODS.GET,
        mockResponse: MOCK_EMAIL_SENDER_LIST,
        useAuthentication: true,
      });
    });
  });

  describe('deleteEmailSender', () => {
    it('should return a promise', () => {
      expect(deleteEmailSender()).toBeInstanceOf(Promise);
    });

    it('should make a request with the correct parametsrs', () => {
      deleteEmailSender('testcode');
      expect(makeRequest).toHaveBeenCalledWith({
        uri: '/api/plugins/emailSettings/senders/testcode',
        method: METHODS.DELETE,
        mockResponse: {},
        useAuthentication: true,
      });
    });
  });
});
