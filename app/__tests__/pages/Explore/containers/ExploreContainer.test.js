import React from 'react';
import ExploreContainer from '../../../../src/pages/Explore/containers/ExploreContainer';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

describe('ExploreContainer', () => {
  it('should render without throwing', () => {
    shallow(<ExploreContainer/>);
  });

  it('renders correctly', () => {
    const tree = renderer
      .create(<ExploreContainer/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  })
});