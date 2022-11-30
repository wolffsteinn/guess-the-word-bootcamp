import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    // Always call super with props in constructor to initialise parent class
    super(props);
    this.state = {
      gameStart: true,
      // currWord is the current secret word for this round. Update this with this.setState after each round.
      currWord: getRandomWord(),
      // guessedLetters stores all letters a user has guessed so far
      guessedLetters: [],
      // Insert num guesses left state here
      numberOfGuessesLeft: 10,
      // Insert form input state here
      value: "",
    };
  }

  generateWordDisplay = () => {
    const wordDisplay = [];
    // for...of is a string and array iterator that does not use index
    for (let letter of this.state.currWord) {
      if (this.state.guessedLetters.includes(letter)) {
        console.log("working");
        wordDisplay.push(letter);
      } else {
        wordDisplay.push("_");
      }
    }

    if (wordDisplay.join("") === this.state.currWord) {
      console.log("win?");
      this.setState({ gameStart: false });
      return;
    }
    console.log(this.state.gameStart);
    return wordDisplay.toString();
  };

  // Insert form callback functions handleChange and handleSubmit here

  // to push the letters into the array?
  //default behaviour of a form element's submit button - it will refresh after you click the submit button
  //html form elements have a submit button - it submits to another link and when you submit, you send a API call in your browser network
  //short ans: when you do HTML forms and you submit, it will refresh your page because its doing something else in the background.
  handleSubmit = (event) => {
    // you need to have this if not it will refresh the entire page
    event.preventDefault();

    //input validation - to check if the input is only 1 character
    if (this.state.value.length !== 1) {
      return;
    }
    // because you are using the previous state, which may or may not have letters in displayed words already
    this.setState((prevState) => ({
      guessedLetters: [...this.state.value, ...prevState.guessedLetters],
      value: "",
    }));

    this.guessesLeft();
  };

  // handleChange = update the letters
  // event === input

  //just keep using arrow functions because CRA is buggy
  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  //handling the number of gueses
  guessesLeft = () => {
    //input validation - to check if the input is only 1 character
    //is there a way to combine the setState of handleSubmit and guessesLeft
    if (this.state.numberOfGuessesLeft === 1) {
      console.log("zero");
      console.log(this.state.currWord);
      this.setState({ gameStart: false });
      return;
    }
    this.setState((prevGuesses) => ({
      numberOfGuessesLeft: prevGuesses.numberOfGuessesLeft - 1,
    }));
  };

  resetGame = () => {
    this.setState({
      guessedLetters: [],
      numberOfGuessesLeft: 10,
      value: "",
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Guess The Word 🚀</h1>
          <h3>Word Display</h3>
          {this.state.gameStart
            ? this.generateWordDisplay()
            : this.state.currWord}
          <h3>Guessed Letters</h3>
          {this.state.guessedLetters.length > 0
            ? this.state.guessedLetters.toString()
            : "-"}
          <h3>Number of guesses left</h3>
          <div>Guesses: {this.state.numberOfGuessesLeft}</div>
          <h3>Input</h3>

          <p>Please submit one letter at a time</p>
          {/* Insert form element here */}
          <form
            onSubmit={this.state.gameStart ? this.handleSubmit : this.resetGame}
          >
            <input
              type="text"
              value={this.state.value}
              onChange={this.state.gameStart ? this.handleChange : null}
            />
            <input
              type="submit"
              value={this.state.gameStart ? "submit" : "reset"}
            />

            {/* if you used button it would be the same? maybe just backend differences?
            <button type = "submit" value = "Submit" onClick = {() => this.guessesLeft()}> submit</button> */}
          </form>
        </header>
      </div>
    );
  }
}

export default App;
