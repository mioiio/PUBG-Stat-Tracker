import React from "react";
import "../index.css";
import Leaderboard from "./leaderboard";
import Spinner from "./Spinner";
import Advertising from "./advertising";
import axios from 'axios';

export default class Content extends React.Component {
  constructor(props) {
    super(props);

    this.toggleActive = this.toggleActive.bind(this);
    this.state = {
      isActive: false,
      table: [],
      dataRecieved: false,
      currentMode: "solo",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setMode= this.setMode.bind(this);
    this.sortBy= this.sortBy.bind(this);

  }

  setMode(mode){ 
    this.setState({
      dataRecieved: false,
    });   
    axios.get(`http://localhost:3001/api/${mode}`)
    .then(response => {
      //console.log(response.data);
      var newArr = [];
      response.data.forEach(elem => {
        //console.log(elem);
        newArr.push(elem);
      })
      //console.log(newArr);
      this.setState({
        table: newArr,
        dataRecieved: true,
        currentMode: mode,
      });
      console.log("this.state.currenyMode content")
      console.log(this.state.currenyMode);
      this.forceUpdate();
    })
    .catch(err => {
      console.log(err);
    });
  }

  tryModeSolo = (e) => {
    e.preventDefault();
    this.setMode("solo");
  }

  tryModeDuo = (e) => {
    e.preventDefault();
    this.setMode("duo");
  }

  tryModeSquad = (e) => {
    e.preventDefault();
    this.setMode("squad");
  }


  sortBy = (field, order)=>{
    var reverse = 0;
    if (order === "DESC") {
      reverse = 1
    }
    if (order === "ASC") {
      reverse = -1
    }
    return function (a, b) {
      if (a[field] < b[field]){
        return reverse;
      } else {
        return -reverse;
      }
        
    } 
  
   }
   
   
  sortForAll = (column, dir) => {
    let newArr = this.state.table;
    newArr=newArr.sort(this.sortBy(column, dir));
    //console.log(newArr);
    this.setState({
      table: newArr,
    });
    //console.log(newArr);
    this.forceUpdate();
  }


  SortKDDesc = (e) => {
    e.preventDefault();
    this.sortForAll("killdeathratio", "DESC");
  }

  SortKDAsc = (e) => {
    e.preventDefault();
    this.sortForAll("killdeathratio", "ASC");
  }
  
  handleSubmit() {
    axios.get(`http://localhost:3001/api`)
      .then(response => {
        //console.log(response.data);
        var newArr = [];
        response.data.forEach(elem => {
          //console.log(elem);
          newArr.push(elem);
        })
        //console.log(newArr);
        this.setState({
          table: newArr,
          dataRecieved: true,
        });
        console.log("this.state.table content")
        console.log(this.state.table);
        this.forceUpdate();
      })
      .catch(err => {
        console.log(err);
      });
  }

  toggleActive() {
    this.setState({
      isActive: !this.state.isActive
    });
  }

  componentDidMount() {
    this.handleSubmit();
    
  }

  renderContent() {
    if (this.state.dataRecieved) {
      return (
        <div>
          <div className="row">
            <div className="column left" />
  
            <div className="column middle">
              <h1 className="tableTitle">Leaderboard: {this.state.currentMode}</h1>
              <button onClick={this.tryModeSolo}>Solo</button>
              <button onClick={this.tryModeDuo}>Duo</button>
              <button onClick={this.tryModeSquad}>Squad</button>
              <button onClick={this.SortKDDesc}>Sort by K/D Desc</button>
              <button onClick={this.SortKDAsc}>Sort by K/D Asc</button>
              <Leaderboard table = {this.state.table}  />
              <p className="tableFoot">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="column right">
              <Advertising />
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner message={"Please wait.."} />;
    }
  }


  render() {
    console.log("this.state.dataRecieved");
    console.log(this.state.dataRecieved);
    return <div>{this.renderContent()}</div>;
  }

}
