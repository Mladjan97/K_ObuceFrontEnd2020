import React from 'react';
import { Redirect } from 'react-router-dom';
import { removeTokenData } from '../../api/api';

interface AdminLogoutPageState {
    done: boolean;
}

export class AdminLogoutPage extends React.Component {
    state: AdminLogoutPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            done: false,
        };
    }

    finished() {
        this.setState({
            done: true,
        });
    }

    render() {
        if (this.state.done) {
            return <Redirect to="/administrator/login/" />
        }

        return (
            <p>Logging out...</p>
        );
    }

    componentDidMount() {
        this.doLogout();
    }

    componentDidUpdate() {
        this.doLogout();
    }

    doLogout() {
        removeTokenData("administrator");
        this.finished();
    }
}