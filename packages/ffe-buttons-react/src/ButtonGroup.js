import React from 'react';
import { bool, string } from 'prop-types';
import classNames from 'classnames';

const ButtonGroup = ({ className, thin, ...rest }) =>
    (
        <div
            className={classNames(
                'ffe-button-group',
                { 'ffe-button-group--thin': thin },
                className
            )}
            {...rest}
        />
    );

ButtonGroup.propTypes = {
    /** Extra class name applied in addition to the FFE classes */
    className: string,
    /** Applies the thin modifier to remove margins */
    thin: bool,
};

export default ButtonGroup;
