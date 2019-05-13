// Greeter.js
import React, {Component} from 'react';
import config from './config.json';
import styles from './Greeter.css';

class Greeter extends Component {
    render() {
        return (
            // 使用cssModule添加类名的方法
            <div className={styles.root}>
                {config.greetText}
            </div>
        );
    }
}

export default Greeter;
