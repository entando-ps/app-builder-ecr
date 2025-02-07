import React from 'react';
import { IntlProvider } from 'react-intl';
import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import { renderWithRedux, renderWithRouterProvider } from 'test/testUtils';
import ContentVersionDetailsContainer from 'ui/versioning/details/ContentVersionDetailsContainer';
import { getLanguages } from 'api/languages';
import { getContentDetails } from 'api/versioning';
import { CONTENT_DETAILS_OK } from 'test/mocks/versioning';
import { LANGUAGES_LIST } from 'test/mocks/languages';

jest.mock('api/languages');
jest.mock('api/versioning');
jest.unmock('react-redux');

describe('ContentVersionDetailsContainer Test', () => {
  it('renders data', async () => {
    renderWithRedux(
      renderWithRouterProvider(
        <IntlProvider locale="en">
          <ContentVersionDetailsContainer />
        </IntlProvider>,
      ),
    );

    expect(getLanguages).toHaveBeenCalledTimes(1);
    expect(getContentDetails).toHaveBeenCalledTimes(1);

    // tabs
    expect(await screen.findByText(LANGUAGES_LIST[0].name)).toBeInTheDocument();
    LANGUAGES_LIST.forEach((language) => {
      if (language.isActive) {
        expect(screen.getByText(language.name)).toBeInTheDocument();
      }
    });

    const activeLanguageNumber = LANGUAGES_LIST.filter(language => language.isActive).length;

    // data
    CONTENT_DETAILS_OK.attributes.forEach((attribute) => {
      if (typeof attribute.values.en === 'string') {
        expect(screen.getAllByText(attribute.values.en)).toHaveLength(activeLanguageNumber);
      }
    });
  });
});
