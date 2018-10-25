import React, { Component } from 'react';
import Form from './Form';
import Person from './Person';
import sampleData from './sampleData';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      childId: 0,
      gender: null,
      lines: [],
      name: '',
      parentId: null,
      peopleTree: null,
      peopleArray: [],
      showForm: true,
      sample: true
    };

    this.addPerson = this.addPerson.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.sampleData = this.sampleData.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.getLines.bind(this));
  }

  handleChange(e) {
    let key = e.target.type === 'radio' ? 'gender' : 'name';
    this.setState({
      [key]: e.target.value
    });
  }

  handleClick(id) {
    this.setState({
      showForm: !this.showForm,
      parentId: id
    });
  }

  resizeSVG() {
    let height = document.documentElement.offsetHeight;
    document.getElementById("svg").style.height = height;
  }

  sampleData() {
    this.setState({
      peopleTree: sampleData,
      showForm: false,
      sample: false,
      childId: 5
    }, this.renderPeople);
  }

  hasChild(node) {
    return node.children[0] !== 'ghost';
  }

  buildChild() {
    return [{
      name: this.state.name,
      gender: this.state.gender,
      id: this.state.childId,
      children: ['ghost']
    }]
  }

  renderLine(parent, child) {
    let lines = this.state.lines;
    let start = document.getElementById(parent.id);
    let end = document.getElementById(child.id);

    lines.push({
      x1: start.offsetLeft + 50,
      y1: start.offsetTop + 50,
      x2: end.offsetLeft + 50,
      y2: end.offsetTop + 50
    });

    this.setState({
      lines,
    });
  }

  getLines() {
    if (this.state.peopleTree === null) { return; }
    this.setState({
      lines: []
    }, function () {
      let peopleTree = this.state.peopleTree;

      let traverseTree = (node) => {
        if (this.hasChild(node)) {
          for (let i = 0; i < node.children.length; i++) {
            this.renderLine(node, node.children[i]);
            traverseTree(node.children[i]);
          }
        }
      }
      traverseTree(peopleTree);
    }, this.resizeSVG);
  }

  renderPeople() {
    let peopleTree = this.state.peopleTree;
    let peopleArray = [];

    let traverseTree = (node, depth) => {
      if (peopleArray[depth]) {
        peopleArray[depth] = peopleArray[depth].concat([node]);
      } else {
        peopleArray[depth] = [node];
      }

      if (this.hasChild(node)) {
        for (let i = 0; i < node.children.length; i++) {
          traverseTree(node.children[i], depth + 1);
        }
      } else {
        if (peopleArray[depth + 1]) {
          peopleArray[depth + 1] = peopleArray[depth + 1].concat(['ghost']);
        } else {
          peopleArray[depth + 1] = ['ghost'];
        }
      }
    }

    traverseTree(peopleTree, 0);

    this.setState({
      peopleArray,
    }, function () {
      this.resizeSVG();
      this.getLines();
    });
  }

  addPerson() {
    let peopleTree = this.state.peopleTree;

    let traverseTree = (node) => {
      if (node.id === this.state.parentId) {
        if (this.hasChild(node)) {
          node.children = node.children.concat(this.buildChild());
          return;
        } else {
          node.children = this.buildChild();
          return;
        }
      }

      if (this.hasChild(node)) {
        for (let i = 0; i < node.children.length; i++) {
          traverseTree(node.children[i]);
        }
      }
    }

    if (peopleTree === null) {
      peopleTree = this.buildChild()[0];
    } else {
      traverseTree(peopleTree);
    }

    this.setState({
      peopleTree,
      childId: this.state.childId + 1,
      gender: null,
      name: '',
      showForm: !this.state.showForm
    }, function () {
      this.renderPeople();
      this.resizeSVG();
    });
  }

  removePerson() {
    let peopleTree = this.state.peopleTree;

    let traverseTree = (node) => {
      if (this.hasChild(node)) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.children[i].id === this.state.parentId) {
            if (node.children.length === 1) {
              node.children[i] = 'ghost';
            } else {
              node.children.splice(i, 1)
            }
            return;
          }
          traverseTree(node.children[i]);
        }
      }
    }

    traverseTree(peopleTree);

    this.setState({
      peopleTree,
      showForm: !this.state.showForm
    }, this.renderPeople)
  }

  render() {
    return (
      <div className="App">
        {this.state.peopleArray.map(tier => {
          return <div className='Tier'>
            {tier.map(person => {
              return <Person
                person={person}
                handleClick={this.handleClick}
                peopleArray={this.state.peopleArray}
              />
            })}
          </div>
        })}
        <svg id='svg'>
          {this.state.lines.map(function (line) {
            return <line className='Line' x1={line.x1} x2={line.x2} y1={line.y1} y2={line.y2} />
          })}
        </svg>
        {this.state.showForm && <Form
          addPerson={this.addPerson}
          handleChange={this.handleChange}
          removePerson={this.removePerson}
        />}
        {this.state.sample && <button className='Sample' onClick={this.sampleData}>Sample Tree</button>}
      </div>
    );
  }
}

export default App;
