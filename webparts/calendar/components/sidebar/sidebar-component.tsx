import * as React from 'react';
import * as moment from 'moment';
import { Layer, IconButton } from 'office-ui-fabric-react';
import * as classnames from 'classnames';

import styles from './sidebar.module.scss';

export interface ISidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    event: any
}
export interface ISidebarState {
    isOpen?: boolean;
    isVisible?: boolean;
}

export default class Sidebar extends React.Component<ISidebarProps, ISidebarState> {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    public componentWillReceiveProps(newProps: ISidebarProps) {

        if (newProps.isOpen === this.props.isOpen)
            return;

        if (newProps.isOpen) {
            if (!this.state.isOpen) {
                this.setState({
                    isOpen: true,
                    isVisible: true
                });
            }
            else {
                this.setState({
                    isVisible: true
                });
            }
        }

        if (!newProps.isOpen && this.state.isOpen) {
            this._close();
        }
    }

    public componentDidUpdate(prevProps: ISidebarProps, prevState: ISidebarState) {
        this._onOpen.bind(this);
    }

    public render(): React.ReactElement<ISidebarProps> {
        if (!this.state.isOpen)
            return null;

        var { event } = this.props;

        const optionalClasses: any = {};
        optionalClasses[styles.visible] = this.state.isVisible;
        const className = classnames(styles.sidebar, optionalClasses);

        return (
            <Layer>
                <div className={className}>
                    <div className={styles.heading}>
                        <div className={styles.closeButton}>
                            <IconButton
                                iconProps={{ iconName: 'Cancel' }}
                                onClick={this._close.bind(this)} />
                        </div>
                        <h3>Event</h3>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <div className={styles.column}>
                                <div className={styles.title}>
                                    <strong>{event.title}</strong>
                                </div>
                                <h4>Event Details</h4>
                                <span className={styles.description}>
                                    {event.extendedProps.eventDetails}
                                </span>
                                <h4>Start Date</h4>
                                <span className={styles.text}>{moment(event.start).format('DD/MM/YYYY HH:mm').toUpperCase()}</span>
                                <h4>End Date</h4>
                                <span className={styles.text}>{moment(event.end).format('DD/MM/YYYY HH:mm').toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Layer>);
    }

    public _close() {
        this.setState({
            isOpen: false
        });

        if (this.props.onClose)
            this.props.onClose();
    }

    private _onOpen() {
        this.setState({
            isVisible: true
        });
    }

}