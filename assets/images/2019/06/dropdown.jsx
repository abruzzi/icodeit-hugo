it('renders label', () => {
  const props = {
    label: 'Name'
  }
  
  const wrapper = shallow(<InputField {...props} />);
  expect(wrapper.find('h6').text()).toBe(props.label);
});

it('renders dropdown', () => {
  const props = {
    label: 'State',
    options: [
      { label: 'VIC', value: 'Victoria' },
      { label: 'WA', value: 'Western Australia' },
      { label: 'SA', value: 'Southern Australia' },
      { label: 'QLD', value: 'Queesland' },
      { label: 'NSW', value: 'New South Wales' }
    ]
  };

  const wrapper = shallow(<Dropdown {...props} />);
  expect(wrapper.find('<Option>').length).toBe(props.options.length);
});