/* Because we are missing aria-controls (http://www.heydonworks.com/article/aria-controls-is-poop): */
/* eslint jsx-a11y/role-has-required-aria-props:0 */
import React, { Component } from 'react';
import { func, string, bool, number } from 'prop-types';
import KryssIkon from '@sb1/ffe-icons-react/lib/kryss-ikon';

class Input extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.state = {
            value: props.value,
            isFocused: false,
        };
    }

    onChange(e) {
        const value = e.target.value;
        this.setState({ value });
        this.props.onChange(value);
    }

    onFocus() {
        this.setState({ isFocused: true });
        this.props.onFocus();
    }

    onBlur() {
        this.setState({ isFocused: false });
        this.props.onBlur();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.isFocused || this.state.value !== nextProps.value) {
            this.setState({ value: nextProps.value });
        }
    }

    render() {
        const {
            onKeyDown,
            value,
            id,
            placeholder,
            isSuggestionsShowing,
            ariaInvalid,
            onReset,
            onClick,
            inputFieldRef,
            highlightedIndex,
            suggestionListId,
            name,
            readOnly,
        } = this.props;

        const showReset = !readOnly && value.length > 0;

        return (
            <div
                role="combobox"
                aria-expanded={isSuggestionsShowing}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                aria-activedescendant={
                    highlightedIndex > -1
                        ? `suggestion-item-${highlightedIndex}`
                        : null
                }
                aria-owns={suggestionListId}
            >
                <input
                    className="ffe-input-field ffe-dropdown ffe-base-selector__input-field"
                    onKeyDown={onKeyDown}
                    autoComplete="off"
                    value={this.state.value}
                    id={id}
                    placeholder={placeholder}
                    ref={inputFieldRef}
                    aria-invalid={ariaInvalid}
                    aria-autocomplete="list"
                    name={name}
                    onClick={onClick}
                    onChange={this.onChange}
                    readOnly={readOnly}
                />
                {showReset && (
                    <button
                        className="ffe-base-selector__reset-button"
                        onMouseDown={e => {
                            e.preventDefault();
                            onReset();
                        }}
                        tabIndex={-1}
                        type="button"
                        aria-label="Reset"
                    >
                        <KryssIkon className="ffe-base-selector__reset-button-icon" />
                    </button>
                )}
            </div>
        );
    }
}

Input.propTypes = {
    onChange: func.isRequired,
    onKeyDown: func.isRequired,
    value: string.isRequired,
    onReset: func.isRequired,
    isSuggestionsShowing: bool.isRequired,
    id: string.isRequired,
    readOnly: bool,
    placeholder: string,
    onBlur: func,
    onFocus: func,
    onClick: func,
    ariaInvalid: bool,
    inputFieldRef: func,
    highlightedIndex: number,
    suggestionListId: string,
    name: string,
};

Input.defaultProps = {
    onBlur: () => {},
    onFocus: () => {},
    inputFieldRef: () => {},
    ariaInvalid: false,
    readOnly: false,
};

export default Input;
