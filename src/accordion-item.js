import React, { Component, PropTypes } from 'react';
import FFEExpandable from 'ffe-expandable-react';
import Chevron from 'ffe-icons-react/chevron-ikon';
import classNames from 'classnames';

const createClasses = (baseClass, isOpen, type) => classNames(baseClass, {
    [`${baseClass}--open`]: isOpen,
    [`${baseClass}--${type}`]: true
});

class AccordionItem extends Component {
    constructor(props) {
        super();
        this.state = {
            isOpen: props.isOpen,
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const {
            ignoredNodeNames,
        } = this.props;

        if (ignoredNodeNames.some(name => name === e.target.nodeName)) {
            return;
        }
        this.toggle();
    }

    toggle() {
        const { isOpen } = this.state;

        if (isOpen) {
            this.props.onClose();
        } else {
            this.props.onOpen();
        }

        this.setState({ isOpen: !isOpen });
    }

    renderExpandedContent() {
        const { isOpen } = this.state;
        const {
            type,
            index,
            expandedContent,
        } = this.props;

        return (
            <div
                className={ createClasses('ffe-accordion-item__content', isOpen, type) }
                role="tabpanel"
                id={ `panel-${index}` }
                aria-hidden={ !isOpen }
                aria-labelledby={ `tab-${index}` }
            >
                { expandedContent }
            </div>
        );
    }

    render(props) {
        const { isOpen } = this.state;
        const {
            children,
            type,
            index,
            ariaLabel
        } = this.props;

        return (
            <li className={ createClasses('ffe-accordion-item', isOpen, type) }>
                <a
                    aria-controls={ `panel-${index}` }
                    aria-expanded={ isOpen }
                    aria-label={ ariaLabel }
                    className={ createClasses('ffe-accordion-item__toggler', isOpen, type) }
                    href="javascript:;"
                    id={`tab-${index}`}
                    onClick={ this.onClick }
                    role="tab"
                >
                    <Chevron className={ createClasses('ffe-accordion-item__icon', isOpen, type) } />
                    { children }
                </a>
                <FFEExpandable
                    expanded={ this.renderExpandedContent() }
                    isOpen={ isOpen }
                />
            </li>
        );
    }
}

AccordionItem.propTypes = {
    ariaLabel: PropTypes.string,
    children: PropTypes.node,
    expandedContent: PropTypes.node,
    ignoredNodeNames: PropTypes.arrayOf(PropTypes.string),
    index: PropTypes.number,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    type: PropTypes.oneOf(['white', 'blue'])
};

AccordionItem.defaultProps = {
    ignoredNodeNames: [],
    onClose: f => f,
    onOpen: f => f,
};

export default AccordionItem;
