import React, { useState } from "react";
import styles from "./App.module.scss";
import { repSelectionOptions, stateOptions } from "./constants";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function DetailsItem({ children, label, isLink, href }) {
  if (!children) return null;
  if (isLink)
    return (
      <label className={styles.detailsItem}>
        {label}
        <a target="_blank" rel="noopener noreferrer" href={href}>
          {children}
        </a>
      </label>
    );
  return (
    <label className={styles.detailsItem}>
      {label}
      {<span>{children}</span>}
    </label>
  );
}

function App() {
  // Handle Form Values
  const [repType, setRepType] = useState("default");
  const [stateCode, setStateCode] = useState("default");
  const handleRepTypeChange = (event) => {
    setRepType(event.target.value);
  };
  const handleStateCodeChange = (event) => {
    setStateCode(event.target.value);
  };

  // Handle details information panel
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const handleResultSelectionChange = (index) => {
    if (index !== selectedResultIndex) {
      setSelectedResultIndex(index);
    }
  };

  // Handle Searching
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleSearch = (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setResults([]);
    setSelectedResultIndex(0);

    if (repType === "default") {
      return setErrorMessage(
        "A Representative or Senator search type must be selected"
      );
    }
    if (stateCode === "default") {
      return setErrorMessage("A state must be selected");
    }

    fetch(`/${repType}/${stateCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResults(data.results);
        } else {
          console.log();
          setErrorMessage(data.error);
        }
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Who's My Representative?</h1>
      </header>

      <main className={styles.main}>
        {/* Error Handling */}
        {errorMessage && (
          <div className={styles.errorContainer}>
            <span className={styles.errorText}>{errorMessage}</span>
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <label>
            Rep/Sen
            <select value={repType} onChange={handleRepTypeChange} required>
              <option value="default" disabled>
                Select your Rep/Sen
              </option>
              {repSelectionOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            State
            <select value={stateCode} onChange={handleStateCodeChange} required>
              <option value="default" disabled>
                Select your State
              </option>
              {stateOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Search</button>
        </form>

        <div className={styles.searchResultsContainer}>
          {/* Results List */}
          <div className={styles.listContainer}>
            <h2>
              List /{" "}
              {repType && repType !== "default" ? (
                <span className={styles.brandColor}>
                  {capitalizeFirstLetter(repType)}
                </span>
              ) : (
                ""
              )}
            </h2>
            <table className={styles.resultsListTable}>
              <tbody>
                <tr className={[styles.row, styles.rowHeader].join(" ")}>
                  <th>Name</th>
                  <th>Party</th>
                </tr>
                {results.map((result, index) => (
                  <tr
                    className={`
                      ${styles.row} ${styles.rowIsSelectable} ${
                      index === selectedResultIndex ? styles.rowIsSelected : ""
                    }`}
                    key={index}
                    onClick={() => handleResultSelectionChange(index)}
                  >
                    <td>{result.name}</td>
                    <td>{result.party[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Result Details */}
          <div className={styles.detailsContainer}>
            <h2>Info</h2>
            {results[selectedResultIndex] && (
              <div>
                <DetailsItem label="First Name">
                  {results[selectedResultIndex].name.split(" ")[0]}
                </DetailsItem>
                <DetailsItem label="Last Name">
                  {results[selectedResultIndex].name.split(" ")[1]}
                </DetailsItem>
                <DetailsItem label="Party">
                  {results[selectedResultIndex].party}
                </DetailsItem>
                <DetailsItem label="State">
                  {results[selectedResultIndex].state}
                </DetailsItem>
                <DetailsItem label="District">
                  {results[selectedResultIndex].district}
                </DetailsItem>
                <DetailsItem label="Phone">
                  {results[selectedResultIndex].phone}
                </DetailsItem>
                <DetailsItem label="Office">
                  {results[selectedResultIndex].office}
                </DetailsItem>
                <DetailsItem
                  label="Link"
                  href={results[selectedResultIndex].link}
                  isLink
                >
                  {results[selectedResultIndex].link}
                </DetailsItem>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
