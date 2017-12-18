import "./app.scss";

import React from "react";

class AppContainer extends React.Component {
    componentDidMount() {
        console.log("Hello, Newman");
    }
    render() {
        return (
            <section>
                <h1>Hello, Newman</h1>
                <button onClick={this._click.bind(this)}>Click Me</button>
            </section>
        );
    }
    _click() {
        console.log('stuff');
    }
}

export default AppContainer;