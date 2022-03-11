import React, { Component } from "react";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

const GETQUOTES = "GETQUOTES";

const quotesReducer = (state = { quotes: [] }, action) => {
  switch (action.type) {
    case GETQUOTES:
      return { ...state, quotes: action.quotes };
    default:
      return state;
  }
};

const store = createStore(quotesReducer);
store.subscribe(() => {
  store.getState();
});
const listQuotes = (quotes) => {
  return {
    type: GETQUOTES,
    quotes,
  };
};

class QuoteBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: "",
      author: "",
    };

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (e.target.getAttribute("id") === "new-quote") {
      let index = Math.floor(Math.random() * this.props.quotes.length);
      let text = document.getElementById("text");
      let author = document.getElementById("author");
      text.innerText = this.props.quotes[index].quote;
      author.innerText = "_" + this.props.quotes[index].name;

      this.setState({
        quote: this.props.quotes[index].quote,
        author: this.props.quotes[index].name,
      });
    } else if (e.target.getAttribute("id") === "tweet-quote" && this.state.currentQuote === "") {
      this.setState({
        quote: this.props.quotes[0].quote,
        author: this.props.quotes[0].name,
      });
    }
  }

  async componentDidMount() {
    try {
      const quotes = await axios.get("https://gist.githubusercontent.com/dmakk767/9375ff01aff76f1788aead1df9a66338/raw/491f8c2e91b7d3b8f1c8230e32d9c9bc1a1adfa6/Quotes.json%2520");
      store.dispatch(listQuotes(quotes.data));
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    document.getElementById("new-quote").removeEventListener("click", this.handleClick);
  }

  render() {
    if (this.props.quotes.length) {
      return (
        <div id="quote-box" className="container">
          <i className="fas fa-quote-left"></i>
          <div className="quote-div container">
            <p id="text">{this.props.quotes[0].quote}</p>
            <p id="author">-{this.props.quotes[0].name}</p>
          </div>
          <div className="btn-div container">
            <button id="new-quote" className="btn btn-primary" onClick={this.handleClick}>
              New Quote
            </button>
            <a id="tweet-quote" className="btn btn-primary" onClick={this.handleClick} href={"https://twitter.com/intent/tweet?hashtags=" + this.state.author + "&text=" + this.state.quote} target="_blank">
              Tweet Quote
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div id="quote-box" className="container">
          <i className="fas fa-quote-left"></i>
          <div className="quote-div container">
            <p id="text">Loading Quotes...</p>
            <p id="author"></p>
          </div>
          <div className="btn-div container">
            <button id="new-quote" className="btn btn-primary">
              New Quote
            </button>
            <a id="tweet-quote" className="btn btn-primary">
              Tweet Quote
            </a>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  let id = -1;
  return {
    quotes: state.quotes.map((quote) => {
      id++;
      return {
        ...quote,
        id,
      };
    }),
  };
};

const ConnectedBox = connect(mapStateToProps)(QuoteBox);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedBox />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
