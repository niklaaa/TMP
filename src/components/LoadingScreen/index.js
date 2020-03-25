import React, {Component} from 'react';

import { Spin } from 'antd';

class Loading extends Component {

    render() {
        return (
            <div>
                <Spin size={this.props.size || "large"}/>
            </div>
        )
    }
}

export default Loading;