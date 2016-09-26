import { shallow, mount } from 'enzyme';
import { expect, assert } from 'chai';
import sinon from 'sinon';
import React from 'react';
import BaseSelector from './base-selector';
import DropDown from '../dropdown/dropdown';
import jsdom from 'jsdom';

global.document = jsdom.jsdom('<!DOCTYPE html><html><body></body></html>');
global.window = document.defaultView;

Object.keys(window).forEach(key => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

describe('<BaseSelector />', () => {

  const items = [
    { id: 1, name: 'Ola Nordmann' },
    { id: 2, name: 'kari Nordmann' }
  ];

  const filter = () => sinon.stub().returns(items);

  const renderItemRow = (item) => <div>{item.name}</div>;

  const onChange = sinon.spy();

  const onBlur = sinon.spy();

  const onFocus = sinon.spy();

  const onItemSelected = sinon.spy();

  const getSelector = () => {
    return (
      <BaseSelector
        filter={ filter }
        items={ items }
        renderItemRow={ renderItemRow }
        multiple={ false }
        onChange={ onChange }
        onBlur={ onBlur }
        onFocus={ onFocus }
        onItemSelected={ onItemSelected }
        locale='nb'
        selectedItems={[]}
      />
    );
  };

  describe('keyboard navigation', () => {
    it('should hide dropdown on input tab and shift+tab', () => {
      const wrapper = shallow(getSelector());
      const input = wrapper.find('input');
      const keyCodeTab = 9;
      const tabEvent = {which: keyCodeTab, shiftKey: false};
      input.simulate('keydown', tabEvent);
      expect(wrapper.find(DropDown)).to.have.length(0);
      input.simulate('focus');
      const tabEventWithShift = {which: keyCodeTab, shiftKey: true};
      input.simulate('keydown', tabEventWithShift);
      expect(wrapper.find(DropDown)).to.have.length(0);
    });

    it('Key Alt+Arrow Up/Down should close/open dropdown', () => {
      const wrapper = shallow(getSelector());
      const input = wrapper.find('input');
      input.simulate('focus');
      expect(wrapper.find(DropDown)).to.have.length(1);
      const arrowUpKeyCode = 38;
      const arrowDownKeyCode = 40;
      const event = {
        altKey: true,
        which: arrowUpKeyCode
      };
      input.simulate('keydown', event);
      expect(wrapper.find(DropDown)).to.have.length(0);
      input.simulate('keydown', {...event, which: arrowDownKeyCode});
      expect(wrapper.find(DropDown)).to.have.length(1);
    });

    it('should not select item until user navigates in list', () => {
      const onItemSelectedSpy = sinon.spy();
      const wrapper = mount(
        <BaseSelector
          filter={ filter }
          items={ items }
          renderItemRow={ renderItemRow }
          multiple={ false }
          onChange={ onChange }
          onBlur={ onBlur }
          onFocus={ onFocus }
          onItemSelected={ onItemSelectedSpy }
          locale='nb'
          selectedItems={[]}
        />
      );
      const input = wrapper.find('input');
      input.simulate('change', {target: {value: 'Ola'}});
      assert.equal(onItemSelectedSpy.callCount, 0);
      const arrowDownKeyCode = 40;
      const tabKeyCode = 9;
      input.simulate('keydown', {which: arrowDownKeyCode});
      wrapper.find('.nfe-account-suggestions__item--highlighted').simulate('keydown', {which: tabKeyCode});
      assert.equal(onItemSelectedSpy.callCount, 1);
    });

    it('should select item and return focus to input field on enter key pressed', () => {
      const onItemSelectedSpy = sinon.spy();
      const wrapper = mount(
        <BaseSelector
          filter={ filter }
          items={ items }
          renderItemRow={ renderItemRow }
          multiple={ false }
          onChange={ onChange }
          onBlur={ onBlur }
          onFocus={ onFocus }
          onItemSelected={ onItemSelectedSpy }
          locale='nb'
          selectedItems={[]}
        />
      );
      const input = wrapper.find('input');
      input.simulate('change', {target: {value: 'Ola'}});
      assert.equal(onItemSelectedSpy.callCount, 0);
      const arrowDownKeyCode = 40;
      const enterKeyCode = 13;
      input.simulate('keydown', {which: arrowDownKeyCode});
      wrapper.find('.nfe-account-suggestions__item--highlighted').simulate('keydown', {which: enterKeyCode});
      assert.equal(onItemSelectedSpy.callCount, 1);
      assert.equal(input.node === document.activeElement, true);
    });
  });

  it('should close dropdown and return focus to input field on esc key pressed', () => {
    const onItemSelectedSpy = sinon.spy();
    const wrapper = mount(
      <BaseSelector
        filter={ filter }
        items={ items }
        renderItemRow={ renderItemRow }
        multiple={ false }
        onChange={ onChange }
        onBlur={ onBlur }
        onFocus={ onFocus }
        onItemSelected={ onItemSelectedSpy }
        locale='nb'
        selectedItems={[]}
      />
    );
    const input = wrapper.find('input');
    const arrowDownKey = 40;
    input.simulate('focus');
    input.simulate('keydown', {which: arrowDownKey});
    assert.equal(onItemSelectedSpy.callCount, 0);
    const escKeyCode = 27;
    wrapper.find('.nfe-account-suggestions__item--highlighted').simulate('keydown', {which: escKeyCode});
    assert.equal(onItemSelectedSpy.callCount, 1);
    assert.equal(input.node === document.activeElement, true);
  });

  it('should render an input field', () => {
    const wrapper = shallow(getSelector());
    expect(wrapper.find('input')).to.have.length(1);
  });

  it('should show dropdown on input focus', () => {
    const wrapper = shallow(getSelector());
    const input = wrapper.find('.nfe-account-selector__search');
    input.simulate('focus');
    expect(wrapper.find(DropDown)).to.have.length(1);
  });

  it('should show reset button when input field has a value', () => {
    const wrapper = shallow(getSelector());
    expect(wrapper.find('.nfe-account-selector__reset-button')).to.have.length(0);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'k'}});
    expect(wrapper.find('.nfe-account-selector__reset-button')).to.have.length(1);
  });

  it('should call filter on input change', () => {
    const filterSpy = sinon.stub();
    const filterFunc = sinon.stub().returns(filterSpy);
    const wrapper = shallow(
      <BaseSelector
        filter={ filterFunc }
        items={ items }
        renderItemRow={ renderItemRow }
        multiple={ false }
        onChange={ onChange }
        onBlur={ onBlur }
        onFocus={ onFocus }
        onItemSelected={ onItemSelected }
        locale='nb'
        selectedItems={[]}
      />
    );
    assert.equal(filterSpy.callCount, 2);
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Ola' }});
    assert.equal(filterSpy.callCount, 4);
  });
});
