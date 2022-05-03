import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";

// Store program parameters as "constants" in SCREAM_CASE at top of file or in dedicated constants file for easy access
// This makes num starting guesses easier to edit than if we had hard-coded 10 everywhere
const NUM_STARTING_GUESSES = 10;
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
      numGuessesLeft: NUM_STARTING_GUESSES,
      // input controls the value in the form field
      input: "",
    };
  }

  generateWordDisplay = () => {
    const wordDisplay = [];
    // Show each letter in current word that exists in guessedLetters
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
  };

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  handleSubmit = (event) => {
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
  };

  checkHasUserGuessedWord = (inputLetter) => {
    // Create new array with spread operator because we do not wish to alter this.state.guessedLetters
    const guessedLetters = [...this.state.guessedLetters, inputLetter];
    for (let letter of this.state.currWord) {
      if (!guessedLetters.includes(letter)) {
        return false;
      }
    }
    // Return true if guessedLetters contains all letters in this.state.currWord
    return true;
  };

  resetGame = () => {
    this.setState({
      currWord: getRandomWord(),
      guessedLetters: [],
      numGuessesLeft: NUM_STARTING_GUESSES,
      input: "",
    });
  };

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
          {/* Show user num letters in word and position of correctly-guessed letters */}
          <h3>Word Display</h3>
          {this.generateWordDisplay()}
          {/* Show user letters they have guessed and num guesses left */}
          <h3>Guessed Letters</h3>
          {this.state.guessedLetters.length > 0
            ? this.state.guessedLetters.toString()
            : "-"}
          <p>Num guesses left: {this.state.numGuessesLeft}</p>
          {/* Input area */}
          <h3>Input</h3>
          <p>Please submit 1 letter at a time.</p>
          <form onSubmit={this.handleSubmit}>
            {/* Disable input fields once user guesses word or runs out of guesses */}
            <input
              type="text"
              value={this.state.input}
              onChange={this.handleChange}
              disabled={shouldDisableInput}
            />
            <input type="submit" value="Submit" disabled={shouldDisableInput} />
          </form>
          {/* Congrats message if user guesses word */}
          {hasUserGuessedWord && (
            <div>
              <p>Congrats on guessing the word!</p>
              {playAgainButton}
            </div>
          )}
          {/* Sorry message if user runs out of guesses */}
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
