import React, {Component} from 'react';

import {connect} from "react-redux";

// AntDesign Components
import { PageHeader, Row, Col } from 'antd';

import Registration from "./components/Registration";
import * as actions from "../../redux/modules/Users/actions";


class Accounting extends Component {

    handleRegistration = (data, callback) =>{
        this.props.onRegistration(data, callback);
    }

    render() {

        return (
            <div>
                <PageHeader title="Accounting" />
                <Row>
                    <Col span={24}>
                        <Registration registration={this.props.registration} handleRegistration={this.handleRegistration} />
                    </Col>
                </Row>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch =>
{
    return{
        onRegistration: (data, callback) => dispatch({type: actions.REGISTRATION, data, callback})
    }
}

const mapStateToProps = state =>{
    return{
        registration: state.usersReducer.registration
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Accounting);