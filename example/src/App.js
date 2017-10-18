import React, { Component } from 'react'
import Demo, {props as P} from 'react-demo'
import Tree from 'react-data-tree'

import './index.css'

export default class App extends Component {
  render () {
    return (
      <div>
        <Demo
          background={'none'}
          target={Tree}
          props={{
            rootPosition: P.choices(['top', 'right', 'bottom', 'left']),
            nodesClassName: P.choices(['test1', 'test2', 'test3']),
            connectorsStyle: P.shape({
              tickness: P.number(1),
              color: P.string('DarkSlateGray'),
              radius: P.number(5),
              height: P.number(15)
            }),
            data: P.json({
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
            })
          }}
        />
      </div>
    )
  }
}
