import React, {Component} from 'react';

const Context = React.createContext();

class ContextProvider extends Component {
  state = {};
  componentDidMount() {}
  componentWillUnmount() {}

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
        }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export {ContextProvider, Context};
