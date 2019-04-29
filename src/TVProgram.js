import React, { Component } from 'react';
import { IS_FINISHING_PERCENT, BASE_API_URL } from './App';


export default class TVProgram extends Component {
  filterProgram(program) {
    return program.filter(
      function(item) {
        var now = new Date();
        var startDate = new Date(item.start);
        var endDate = new Date(item.start);
        endDate.setSeconds(startDate.getSeconds() + parseInt(item.duration));
        return (endDate >= now);
      }
    )
  };

  formatTime(dateISO) {
    var date = new Date(dateISO);
    var hours = date.getHours();
    var minutes = date.getMinutes()
    if (hours   < 10) 
      {hours   = "0"+hours;}
    if (minutes < 10) 
      {minutes = "0"+minutes;}
    return hours+':'+minutes;
  };

  dateClass(date, duration) {
    var now = new Date();
    var startDate = new Date(date);
    var endDate = new Date(date);
    endDate.setSeconds(startDate.getSeconds() + parseInt(duration));
    var dateClass = "";

    if (startDate <= now) {
      var timePercent = (endDate - startDate)/100;
      var timedeltaToEnd = (endDate - now);
      
      if (timedeltaToEnd < timePercent*IS_FINISHING_PERCENT) { //isFinishing
        dateClass = 'list-group-item-danger';
      } else {
        dateClass = 'list-group-item-success';
      }
    }
    return dateClass;
  }

  render() {
    var currentChannel = this.props.channels[this.props.channelIndex];
    var logoUrl = 
      (this.props.channelIndex !== undefined) ?
        BASE_API_URL + currentChannel.logo : ""
    var mbNoProgram = this.props.program.length === 0 ? "Нет программы" : "";
    var filteredProgram = this.filterProgram(this.props.program)

    return (
      <div className="pt-2 pb-2">
        <div>
          <img src={logoUrl} alt="No logo"></img>
        </div>
        <div className="p-2">{mbNoProgram}</div>
        <ul className="list-group">

          {filteredProgram.map((program, index) => {
              var addClass = this.dateClass(program.start, program.duration);
              var classNames = 'list-group-item ' + addClass;
              return (
                <li key={index} className={classNames}>
                  {this.formatTime(program.start)} {program.title} 
                </li>
              )
          })}

        </ul>
      </div>
    )
  }
}
