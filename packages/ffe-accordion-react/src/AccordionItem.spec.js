import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { AccordionItem } from '.';

const getWrapper = props => shallow(<AccordionItem {...props} />);

describe('<AccordionItem />', () => {
    it('renders without exploding', () => {
        const wrapper = getWrapper();
        expect(wrapper.exists()).toBe(true);
    });

    describe('expanded content', () => {
        const getWrapperWithExpandedContent = props =>
            getWrapper({ expandedContent: 'Expanded content', ...props });
        it('is hidden by default', () => {
            const wrapper = getWrapperWithExpandedContent();
            expect(wrapper.state('isOpen')).toBe(false);
        });
        it('can be shown to begin with', () => {
            const wrapper = getWrapperWithExpandedContent({ isOpen: true });
            expect(wrapper.state('isOpen')).toBe(true);
        });
        it('can be controlled from the outside', () => {
            const wrapper = getWrapperWithExpandedContent({ isOpen: false });
            expect(wrapper.find('Collapse').prop('isOpened')).toBe(false);

            wrapper.setProps({ isOpen: true });

            expect(wrapper.find('Collapse').prop('isOpened')).toBe(true);
        })
        it('it toggled by clicking', () => {
            const wrapper = getWrapperWithExpandedContent();
            wrapper
                .find('.ffe-accordion-item__toggler')
                .simulate('click', { target: { nodeName: 'div' } });
            expect(wrapper.state('isOpen')).toBe(true);
        });
        it('is not toggled when clicked item is included in ignoredNodeNames prop', () => {
            const wrapper = getWrapperWithExpandedContent({
                ignoredNodeNames: ['button'],
            });
            wrapper
                .find('.ffe-accordion-item__toggler')
                .simulate('click', { target: { nodeName: 'button' } });
            expect(wrapper.state('isOpen')).toBe(false);
        });
        it('is toggled by enter or space', () => {
            const wrapper = getWrapperWithExpandedContent();

            wrapper.find('.ffe-accordion-item__toggler').simulate('keyup', {
                target: { nodeName: 'div' },
                keyCode: 13,
            }); // enter
            expect(wrapper.state('isOpen')).toBe(true);

            wrapper.find('.ffe-accordion-item__toggler').simulate('keyup', {
                target: { nodeName: 'div' },
                keyCode: 32,
            }); // esc
            expect(wrapper.state('isOpen')).toBe(false);
        });
        it('toggling onToggle props', () => {
            const onToggleSpy = jest.fn();

            const wrapper = getWrapperWithExpandedContent({
                onToggle: onToggleSpy,
            });
            wrapper
                .find('.ffe-accordion-item__toggler')
                .simulate('click', { target: { nodeName: 'div' } });

            expect(onToggleSpy).toHaveBeenCalledTimes(1);
            expect(onToggleSpy).toHaveBeenCalledWith(true);

            wrapper
                .find('.ffe-accordion-item__toggler')
                .simulate('click', { target: { nodeName: 'div' } });

                expect(onToggleSpy).toHaveBeenCalledTimes(2);
                expect(onToggleSpy).toHaveBeenCalledWith(false);
        });
    });
});
