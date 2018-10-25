import React, { Component } from 'react'

class Person extends Component {
  isGhost() {
    return this.props.person === 'ghost';
  }

  render() {
    return (
      <div>
        {!this.isGhost() && <div
          className={`Person ${this.props.person.gender}`}
          id={this.props.person.id}
          onClick={this.props.handleClick.bind(null, this.props.person.id)}>
          {this.props.person.name}
        </div>}
        {this.isGhost() && <div className='Ghost' />}
      </div>
    )
  }
}

export default Person;
