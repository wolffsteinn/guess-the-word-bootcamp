import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    // Always call super with props in constructor to initialise parent class
    super(props);
    this.state = {
      // currWord is the current secret word for this round. Update this with this.setState after each round.
      currWord: getRandomWord(),
      // guessedLetters stores all letters a user has guessed so far
      guessedLetters: [],
      // Give the user 10 guesses to start
      numGuessesLeft: 10,
      // input controls the value in the form field
      input: "",
    };
    // This binding is necessary to make `this` work in the callback
    this.generateWordDisplay = this.generateWordDisplay.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkHasUserGuessedWord = this.checkHasUserGuessedWord.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  generateWordDisplay() {
    const wordDisplay = [];
    // for...of is a string and array iterator that does not use index
    for (let letter of this.state.currWord) {
      if (
        this.state.guessedLetters.includes(letter) ||
        // Show full word if numGuessesLeft is 0
        this.state.numGuessesLeft === 0
      ) {
        wordDisplay.push(letter);
      } else {
        wordDisplay.push("_");
      }
    }
    return wordDisplay.toString();
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleSubmit(event) {
    // Prevent default form submit behaviour that refreshes the page
    event.preventDefault();

    // Do nothing if submission is empty
    if (!this.state.input) {
      return;
    }

    // Only save lowercased first letter of submission
    const inputLetter = this.state.input[0].toLowerCase();

    this.setState((state) => ({
      // Use previous state (not this.state) to generate the new state for guessedLetters
      // Use spread operator with new array so React knows to re-render
      guessedLetters: [...state.guessedLetters, inputLetter],
      // Reduce num guesses left if the user guessed wrongly
      numGuessesLeft: this.state.currWord.includes(inputLetter)
        ? this.state.numGuessesLeft
        : this.state.numGuessesLeft - 1,
      // Reset input field
      input: "",
    }));
  }

  checkHasUserGuessedWord(inputLetter) {
    // Create new array with spread operator because we do not wish to alter this.state.guessedLetters
    const guessedLetters = [...this.state.guessedLetters, inputLetter];
    for (let letter of this.state.currWord) {
      if (!guessedLetters.includes(letter)) {
        return false;
      }
    }
    // Return true if guessedLetters contains all letters in this.state.currWord
    return true;
  }

  resetGame() {
    this.setState({
      // currWord is the current secret word for this round. Update this with this.setState after each round.
      currWord: getRandomWord(),
      // guessedLetters stores all letters a user has guessed so far
      guessedLetters: [],
      // Give the user 10 guesses to start
      numGuessesLeft: 10,
      // input controls the value in the form field
      input: "",
    });
  }

  render() {
    // Determine if the user has correctly guessed the word
    const hasUserGuessedWord = this.checkHasUserGuessedWord();
    const shouldDisableInput =
      hasUserGuessedWord || this.state.numGuessesLeft === 0;
    const playAgainButton = (
      <button onClick={this.resetGame}>Play Again</button>
    );
    return (
      <div className="App">
        <header className="App-header">
          <h1>Guess The Word 🚀</h1>
          <h3>Word Display</h3>
          {this.generateWordDisplay()}
          <h3>Guessed Letters</h3>
          {this.state.guessedLetters.length > 0
            ? this.state.guessedLetters.toString()
            : "-"}
          <p>Num guesses left: {this.state.numGuessesLeft}</p>
          <h3>Input</h3>
          <p>Please submit 1 letter at a time.</p>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.input}
              onChange={this.handleChange}
              disabled={shouldDisableInput}
            />
            {/* Disable input field after user successfully guesses word */}
            <input type="submit" value="Submit" disabled={shouldDisableInput} />
          </form>
          {hasUserGuessedWord && (
            <div>
              <p>Congrats on guessing the word!</p>
              {playAgainButton}
            </div>
          )}
          {this.state.numGuessesLeft === 0 && !hasUserGuessedWord && (
            <div>
              <p>Sorry, you ran out of guesses.</p>
              {playAgainButton}
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
