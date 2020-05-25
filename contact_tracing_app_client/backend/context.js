import React, {Component} from 'react';

const Context = React.createContext();

class ContextProvider extends Component {
  state = {isLoggedIn: false};
  componentDidMount() {}
  componentWillUnmount() {}

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          setLoggedIn: () => {
            this.setState({isLoggedIn: true});
          },
          setLogout: () => {
            this.setState({isLoggedIn: false});
          },
        }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export {ContextProvider, Context};
