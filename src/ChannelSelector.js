import React, { Component } from 'react';

export default class ChannelSelector extends Component {
  render() {
    return (
      <div className="pt-2">
        <div>Выберите канал:</div>
        <select id="channel" className="custom-select w-auto"
        value={this.props.currentChannelIndex} 
        onChange={this.props.onChange}>
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
