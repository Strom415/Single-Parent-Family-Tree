import React, { Component } from 'react';

class Form extends Component {
  render() {
    return (
      <div className='FormOuter'>
        <div className='FormInner'>
          <form>
            <div>
              Name: <input type='text' onChange={this.props.handleChange} autofocus="true" />
            </div>
            <div>
              Gender:
                <input type="radio" value="Male" onChange={this.props.handleChange} /> Male
                <input type="radio" value="Female" onChange={this.props.handleChange} /> Female
            </div>
          </form>
          <button onClick={this.props.addPerson}> Save Child </button>
          <button onClick={this.props.removePerson}> Delete Person </button>
        </div>
      </div>
    );
  }
}

export default Form;
