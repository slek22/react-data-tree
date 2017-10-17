import React, { Component } from 'react'

import Tree from 'react-data-tree'

import './index.css'

export default class App extends Component {
  render () {
    return (
      <div>
        <h1>react-data-tree</h1>
        <Tree
          connectorsStyle={{
            tickness: 5,
            color: 'purple',
            radius: 7,
            height: 15
          }}
          data={{
            text: 'root',
            children: [{
              text: 'foo'
            },
            {
              text: 'foo',
              children: [{
                text: 'foo'
              },
              {
                text: 'bar'
              },
              {
                text: 'baz'
              }]
            },
            {
              text: 'baz',
              children: [{
                text: 'foo',
                children: [{
                  text: 'Yeahhhhh /o/'
                }]
              },
              {
                text: 'bar'
              }]
            }]
          }}
        />
      </div>
    )
  }
}
