// 【译】throttle和debounce在react中的应用

// 使用react构建应用程序时，我们总会遇到一些限制问题，比如大量的调用、异步网络请求和DOM更新等，我们可以使用react提供的功能来检查这些。
// shoueldComponentUpdate生命周期钩子
// React.PureComponent
// React.memo
// Windowing and Virtualization
// Memoization
// Hydration
// Hooks(useState, useMemo, useContext, useReducer等)

// 从一个例子开始
// 例子1，解释节流和防抖带给我们的好处，假设我们有一个autocomp组件
import React from 'react';
import './autocomp.css';
class autocomp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: []
        }
    }
    handleInput = evt => {
        const value = evt.target.value;
        fetch(`/api/users`)
            .then(res => res.json())
            .then(result => this.setState({results: result.users}))
    }
    render() {
        let {results} = this.state;
        return (
            <div className='autocomp_wrapper'>
                <input placeholder="Enter your search.." onChange={this.handleInput} />
                <div>
                    {results.map(item => {item})}
                </div>
            </div>
        )
    }
}
export default autocomp;
// 在我们的autocomp组件中，一旦我们在输入框中输入一个单词，它就会请求api/users获取要显示的用户列表。在每个字母输入后，触发异步网络请求，并且成功后通过this.setState更新DOM。

// 例子2
// 使用resize和scroll等事件。大多数情况下，网站每秒滚动1000次，想象一下在scroll事件中添加一个事件处理。
document.body.addEventListener('scroll', () => {
    console.log('scrolled')
})
// 这个函数每秒被执行1000次，如果这个事件处理函数执行大量计算或大量DOM操作，将面临最坏的情况。

// 使用节流和防抖来避免这种性能瓶颈

// 节流Throttle
// 节流强制一个函数在一段时间内可以调用的最大次数
// 使用underscore
import * as _ from underscore;
this.handleInputThrottled = _.throttle(this.handleInput, 100);
// 使用lodash
import {throttle} from lodash;
this.handleInputThrottled = throttle(this.handleInput, 100);
// 使用RxJS
import {BehaviorSubject} from 'rxjs';
import {throttle} from 'rxjs/operators';
class autocomp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        }
        this.inputStream = new BehaviorSubject()
    }
    componentDidMount() {
        this.inputStream
            .pipe(
                throttle(1000)
            )
            .subscribe(v => {
                const filteredRes = data.filter((item) => {
                    // algorithm to search through the `data` array
                })
                this.setState({results: filteredRes})
            })
    }
    render() {
        let {results} = this.state;
        return (
            <div className='autocomp_wrapper'>
                <input placeholder="Enter your search.." onChange={e => this.inputStream.next(e.target.value)} />
                <div>
                    {results.map(result => {result})}
                </div>
            </div>
        )
    }
}

// 防抖debounce
// 防抖忽略对函数的所有调用，直到函数停止调用一段时间之后才会再次执行。
// 使用underscore
import * as _ from 'underscore';
this.handleInputThrottled = _.debounce(this.handleInput, 100)
// 使用lodash
import {debounce} from 'lodash';
this.handleInputThrottled = debounce(this.handleInput, 100)
// 使用RxJS
import {BehaviorSubject} from 'rxjs';
import {debounce} from 'rxjs/operators';
this.inputStream = new BehaviorSubject();
componentDidMount() {
    this.inputStream
        .pipe(
            debounce(100)
        )
        .subscribe(v => {
            const filteredRes = data.filter((item) => {
                // algorithm to search through the `data` array
            })
            this.setState({results: filteredRes})
        })
}

