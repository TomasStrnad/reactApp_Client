import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import authHeader from './_helpers/authHeader';
import { Button } from 'reactstrap';
import { Form, Input, FormGroup, Container, Label, Row, Col } from 'reactstrap';
import $ from 'jquery';
window.jQuery = window.$ = $;


class NewTaskForm extends Component {

  state = { NewTaskName: "", NewTaskDueDate: "" };
  componentDidMount() {
    var _this = this;
    var aScript = document.createElement('link');
    aScript.rel = 'stylesheet';
    aScript.href = "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.8.0/css/bootstrap-datepicker.css";

    document.head.appendChild(aScript);
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.8.0/js/bootstrap-datepicker.js").then(function () {

      $('#newTaskDueDate').datepicker().on('changeDate', function (ev) {
        // $("#newTaskDueDate").change();
        // _this.state.NewTaskDueDate = ev.date;
        _this.setState({ NewTaskDueDate: $("#newTaskDueDate").val() });
      });
    })
    //$(".DatePicker").val("aaaa");/

  }
  createNewTask = () => {
    //alert("should create new Task " + this.state.NewTaskName+ "\\" + this.state.NewTaskDueDate);
    var _this = this;
    var task = { Name: this.state.NewTaskName, DueDate: this.state.NewTaskDueDate };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    };

    return fetch('http://localhost:5000/task/CreateTask', requestOptions).then(() => {
      this.props.onSubmint();
    }, handleError);

  }
  render() {
    return (<Container>
      <Row>
        <Col>
          <Input value={this.state.NewTaskName}
            onChange={(event) => this.setState({ NewTaskName: event.target.value })}></Input></Col>
        <Col><Input id='newTaskDueDate' value={this.state.NewTaskDueDate} onChange={(event) => this.setState({ NewTaskDueDate: event.target.value })}></Input></Col>
        <Col><Button onClick={this.createNewTask}>save</Button></Col>
      </Row>
    </Container>);
  }

}
const OneTask = (props) => {
  return (
    <Row>
      <Col>
        <div>
          {props.name};
      </div>
      </Col>
      <Col><div>
        {props.dueDate};
      </div>
      </Col>
      <Col><Button color="danger" onClick={()=>props.onDeletePass(props.id)}>Delete</Button>
      </Col>
    </Row>
  );

}
const TaskList = (props) => {
  return (
    <Container>
      {props.Tasks.map(task => <OneTask onDeletePass={props.onDelete} key={task.id} {...task} />)}
    </Container>
  );
}
class App extends Component {
  state = {
    Tasks: []
  };
  AddNewTask = (taskCreateInfo) => {

  }
  DeleteOneTask = (id) => {
    const requestOptions = {
      method: 'DELETE',
      headers: authHeader()
  };

  return fetch('http://localhost:5000/task/' + id, requestOptions).then(this.RealoadTaskFromDB(), handleError);
  }
  RealoadTaskFromDB = () => {

    axios.get(`http://localhost:5000/task`)
      .then(resp => {
        var Tasks = resp.data;
        this.setState({ Tasks: Tasks });
        //this.props.(resp.data);
        //this.setState({ userName: '' });
      });
  }
  componentDidMount() {
   

    this.RealoadTaskFromDB();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <TaskList onDelete={this.DeleteOneTask} Tasks={this.state.Tasks}></TaskList>
        <NewTaskForm onSubmint={this.RealoadTaskFromDB}></NewTaskForm>
      </div>
    );
  }
}

function handleResponse(response) {
  return new Promise((resolve, reject) => {
    if (response.ok) {
      // return json if it was returned in the response
      var contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        response.json().then(json => resolve(json));
      } else {
        resolve();
      }
    } else {
      // return error message from response body
      response.text().then(text => reject(text));
    }
  });
}

function handleError(error) {
  return Promise.reject(error && error.message);
}

export default App;
