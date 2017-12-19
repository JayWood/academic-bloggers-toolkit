import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Button from 'components/button';
import * as styles from './autocite.scss';

/** CSL types that are able to be autocited */
export type AutociteKind = 'webpage' | 'book' | 'chapter';

interface Props {
    /** Describes the type of autocite needed */
    kind: AutociteKind;
    /** Validation pattern for input field */
    pattern?: string;
    /** Placeholder text for input field */
    placeholder: string;
    /** Function to call when autocite is submitted */
    getter(kind: string, query: string): void;
}

@observer
export default class AutoCite extends React.Component<Props> {
    static readonly labels = top.ABT.i18n.dialogs.add.manualEntryContainer;

    /** Ref to the input field (needed for validation) */
    input: HTMLInputElement;

    /** Controls the value of the input field */
    query = observable('');

    @action
    handleAutociteFieldChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.query.set(e.currentTarget.value);
    };

    @action
    handleQuery = (): void => {
        if (this.query.get().length === 0 || !this.input.validity.valid) return;
        this.props.getter(this.props.kind, this.query.get());
        this.query.set('');
    };

    bindRefs = (c: HTMLInputElement): HTMLInputElement => (this.input = c);

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' || e.key === 'Return') {
            e.stopPropagation();
            e.preventDefault();
            this.handleQuery();
        }
    };

    render(): JSX.Element {
        const { placeholder, kind } = this.props;
        return (
            <div className={styles.autocite}>
                <label htmlFor="citequery" children={AutoCite.labels.autocite} />
                <input
                    type={kind === 'webpage' ? 'url' : 'text'}
                    id="citequery"
                    className={styles.input}
                    placeholder={placeholder}
                    pattern={this.props.pattern ? this.props.pattern : undefined}
                    ref={this.bindRefs}
                    value={this.query.get()}
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleAutociteFieldChange}
                />
                <Button
                    flat
                    disabled={this.query.get().length === 0 || !this.input.validity.valid}
                    label={AutoCite.labels.search}
                    onClick={this.handleQuery}
                />
            </div>
        );
    }
}