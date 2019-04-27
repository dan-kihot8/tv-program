import React, { Component } from 'react';
// import logo from './logo.svg';
import * as axios from 'axios';
import './App.css';


const baseApiUrl = "http://epg.domru.ru"
const isFinishingPercent = 20;

export default class App extends Component  {
  constructor(props) {
    super(props);
    this.selectChannel = this.selectChannel.bind(this);
    this.getChannels = this.getChannels.bind(this);
    this.getProgram = this.getProgram.bind(this);
    this.state = {
      channels: [],
      currentChannelIndex: undefined,
      channelProgram: []
    };
  }

  componentWillMount() {
    this.getChannels();
  }

  getChannels() {
    axios.get(baseApiUrl + '/channel/list?domain=perm')
      .then((res) => {
        this.setState({
          channels: res.data,
          currentChannelIndex: 0
        });
        var xvid = this.state.channels[0].xvid;
        this.getProgram(xvid);
      })
      .catch((err) => {
        alert("Error while get list of channels!");
      });
  }

  getProgram(xvid) {
    var date_from = new Date();
    var date_to = new Date();
    date_from = date_from.toISOString().substr(0,10);
    date_to = new Date(date_to.setDate(date_to.getDate() + 1)).toISOString().substr(0,10);
    var url = '{0}/program/list?date_from={1}+00:00:00&date_to={2}+00:00:00&domain=perm&xvid[0]={3}'.format(baseApiUrl, date_from, date_to, xvid);
    axios.get(url)
      .then((res) => {
        this.setState({
          channelProgram: res.data[xvid] || []
        });
      })
      .catch((err) => {
        this.setState({
          channelProgram: []
        });
        alert("Error while get list of program for the channel!");
      });
  }

  selectChannel(e) {
    var chIndex = e.target.value;
    this.setState({currentChannelIndex: chIndex})
    var xvid = this.state.channels[chIndex].xvid;
    this.getProgram(xvid)
  }

  render() {
    var currentChannelXvid = 
      (this.state.currentChannelIndex !== undefined) ?
        this.state.channels[this.state.currentChannelIndex].xvid : ""

    return (
      <div className="container pt-2 pb-2">
        <h2 className="h2">TV program</h2>
        <div className="">
          <ChannelSelector
            onChange={this.selectChannel}
            channels={this.state.channels}
          />
        </div>
        <div>Current channel: {currentChannelXvid}</div>
        <TVProgram
          channels={this.state.channels}
          channelIndex={this.state.currentChannelIndex}
          program={this.state.channelProgram}
        />
      </div>
    );
  }


}

class ChannelSelector extends Component {
  render() {
    return (
      <div>
        <select id="channel" value={this.props.currentChannelIndex} onChange={this.props.onChange}>
          {this.props.channels.map((ch, index) => {
            return (
              <option key={ch.chid} value={index}> {ch.title} </option>
            )
          })}
        </select>
      </div>
    )
  }
}

class TVProgram extends Component {
  render() {
    var currentChannel = this.props.channels[this.props.channelIndex];
    var logoUrl = 
      (this.props.channelIndex !== undefined) ?
        baseApiUrl + currentChannel.logo : ""
    var mbNoProgram = this.props.program.length === 0 ? "No program" : "";

    return (
      <div>
        <div>
          <img src={logoUrl} alt="No logo"></img>
        </div>
        <div className="p2">{mbNoProgram}</div>
        <ul className="list-group">

          {this.props.program.map((program, index) => {
              var addClass = dateClass(program.start, program.duration);
              var classNames = 'list-group-item ' + addClass;
              return (
                <li key={index} className={classNames}>
                  {formatTime(program.start)} {program.title} 
                </li>
              )
          })}

        </ul>
      </div>
    )
  }
}

function formatTime(dateISO) {
  var date = new Date(dateISO);
  var hours = date.getHours();
  var minutes = date.getMinutes()
  if (hours   < 10) 
    {hours   = "0"+hours;}
  if (minutes < 10) 
    {minutes = "0"+minutes;}
  return hours+':'+minutes;
}

function dateClass(date, duration) {
  var now = new Date();
  var startDate = new Date(date);
  var endDate = new Date(date);
  endDate.setSeconds(startDate.getSeconds() + parseInt(duration));
  var dateClass = "";
  if (endDate < now) {
      dateClass = 'd-none';
    } else
  if (startDate <= now) {
    var timePercent = (endDate - startDate)/100;
    var timedeltaToEnd = (endDate - now);
    
    if (timedeltaToEnd < timePercent*isFinishingPercent) { //isFinishing
      dateClass = 'list-group-item-danger';
    } else {
      dateClass = 'list-group-item-success';
    }
  }
  return dateClass;
}

String.prototype.format = function() {
  var a = this;
  for (var k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}