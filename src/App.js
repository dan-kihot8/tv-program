import React, { Component } from 'react';
import * as axios from 'axios';
import './App.css';
import TVProgram from './TVProgram';
import ChannelSelector from './ChannelSelector';

export const BASE_API_URL = "https://epg.domru.ru"
export const IS_FINISHING_PERCENT = 20;

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
    axios.get(BASE_API_URL + '/channel/list?domain=perm')
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
    var url = '{0}/program/list?date_from={1}+00:00:00&date_to={2}+00:00:00&domain=perm&xvid[0]={3}'.format(BASE_API_URL, date_from, date_to, xvid);
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

    return (
      <div className="container pt-2 pb-2">
        <h2 className="h2">TV-программа dom.ru</h2>
        <div className="">
          <ChannelSelector
            onChange={this.selectChannel}
            channels={this.state.channels}
          />
        </div>
        <TVProgram
          channels={this.state.channels}
          channelIndex={this.state.currentChannelIndex}
          program={this.state.channelProgram}
        />
      </div>
    );
  }
}

var string = String;
string.prototype.format = function() {
  var a = this;
  for (var k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}