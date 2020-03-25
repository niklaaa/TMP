import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';

import { firebaseConnect } from 'react-redux-firebase';

// AntDesign Components
import { PageHeader } from 'antd';

// const cmp = compose(firebaseConnect(), connect(({firebase: {auth}}) => ({auth})));


class Dashboard extends Component {

    render() {
        return (
            <div>
                <PageHeader title="Dashboard" />
            </div>
        );
    }
}


export default Dashboard;
// export default cmp(Dashboard);