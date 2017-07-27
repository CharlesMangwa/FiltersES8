/* @flow */

import React, { Component } from 'react'
import logo from './logo.svg'
import data from './data.js'
import './App.css'

const Button = ({ data, text, onClick }) =>
  <button onClick={() => onClick(data)}>
    {text}
  </button>

class App extends Component {
  state = {
    buttons: [
      { id: 0, text: 'Duration ≤ 3600s ⏲️', criteria: { duration: 3600 } },
      {
        id: 1,
        text: 'Contributors 🤝',
        criteria: { target: 'contributor' },
      },
      { id: 2, text: 'Managers ‍🕺', criteria: { target: 'manager' } },
      { id: 3, text: 'Management 👨‍💻', criteria: { theme: 'management' } },
      { id: 4, text: 'Finance 💸', criteria: { theme: 'finance' } },
    ],
    filters: {},
    filteredData: [],
  }

  componentWillMount = () =>
    this.setState(state => ({ filteredData: data }))

  _handleFilters = criteria => {
    const filter = Object.keys(criteria)[0]
    const filterValue = Object.values(criteria)[0]

    if (
      this.state.filters[filter] &&
      this.state.filters[filter].length &&
      this.state.filters[filter].includes(filterValue)
    ) {
      if (this.state.filters[filter].length === 1) {
        const { [filter]: removedFilter, ...remainingFilters } = this.state.filters
        this.setState(
          state => ({ filters: { ...remainingFilters } }),
          () => this._filterData(),
        )
      }
      else if (this.state.filters[filter].length > 1) {
        this.setState(
          state => ({
            filters: {
              ...state.filters,
              [filter]: [
                ...state.filters[filter].slice(0,state.filters[filter].indexOf(filterValue)),
                ...state.filters[filter].slice(state.filters[filter].indexOf(filterValue) + 1),
              ],
            },
          }),
          () => this._filterData(),
        )
      }
    }
    else {
      const existingFilters = this.state.filters[filter] || []

      this.setState(
        state => ({
          filters: {
            ...state.filters,
            [filter]:
              filter === 'theme'
                ? [filterValue]
                : [...existingFilters, filterValue],
          },
        }),
        () => this._filterData(),
      )
    }
  }

  _filterData = () => {
    let filteredData = data.slice()

    Object.keys(this.state.filters).map(filterKey =>
      this.state.filters[filterKey].map(filterValue =>
        data.map(element =>
          (filteredData = filteredData.filter(item =>
            (filterKey === 'duration' && item.duration && item.duration <= filterValue) ||
            item[filterKey] === filterValue,
        )))
      )
    )

    this.setState(() => ({ filteredData }))
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>👩‍💻 2k17 Workshops 👨‍💻</h2>
          <i>Filtering, the ES2017+ way</i>
        </div>

        <p className="App-intro">
          {this.state.buttons.map(button =>
            <Button
              data={button.criteria}
              key={button.id}
              onClick={this._handleFilters}
              text={button.text}
            />,
          )}
        </p>

        {this.state.filteredData.map(framework =>
          <p key={framework.id}>
            • {framework.text}
          </p>,
        )}

        <div className="App-footer">
          🕵️‍♂️ Actived filters 🔍:
          {Object.keys(this.state.filters).map(filterKey =>
            this.state.filters[filterKey].map((filterValue, index) =>
              <span key={index}>
                {' '}{filterKey} = {filterValue} |
              </span>,
            ),
          )}
        </div>
      </div>
    )
  }
}

export default App
