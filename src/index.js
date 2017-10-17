import React, { Component } from 'react';
import classnames from 'classnames';
import { capitalize } from 'lodash';
import { oneOf, oneOfType, arrayOf, shape, number, string, node } from 'prop-types';

import { TOP, RIGHT, BOTTOM, LEFT } from './constants';

import './styles.scss';

// for nested proptypes
const lazyFunction = f => ((...args) => f().apply(this, args));

const nodeShape = oneOfType([
  shape({
    text: string.isRequired,
    children: arrayOf(lazyFunction(() => nodeShape))
  }),
  shape({
    element: node.isRequired,
    children: arrayOf(lazyFunction(() => nodeShape))
  })
]);

class Tree extends Component {

  static propTypes = {
    rootPosition: oneOf([TOP, RIGHT, BOTTOM, LEFT]),
    connectorsStyle: shape({
      tickness: number,
      color: string,
      radius: number,
      height: number
    }),
    data: nodeShape.isRequired
  }

  static defaultProps = {
    rootPosition: TOP
  }

  isVertical = () => {
    const { rootPosition } = this.props
    return rootPosition === TOP
      || rootPosition === BOTTOM;
  }

  getBordersPosition = (isFirst, isLast) => {
    const { rootPosition } = this.props;
    if (!isFirst && !isLast) return capitalize(rootPosition);
    switch (rootPosition) {
      case TOP:
        return isFirst ? 'TopLeft' : 'TopRight';
      case RIGHT:
        return isFirst ? 'TopRight' : 'BottomRight';
      case BOTTOM:
        return isFirst ? 'BottomLeft' : 'BottomRight';
      case LEFT:
        return isFirst ? 'TopLeft' : 'BottomLeft';
      default:
        // TODO
    }
  }

  getBordersStyle = (isFirst, isLast) => {
    const { tickness, color, radius, height } = this.props.connectorsStyle;
    const bordersPosition = this.getBordersPosition(isFirst, isLast);
    const borderRadiusKey = `border${bordersPosition}Radius`;
    const borderHeightKey = this.isVertical() ? 'height' : 'width';
    return {
      borderWidth: tickness,
      borderColor: color,
      [borderRadiusKey]: radius,
      [borderHeightKey]: height
    }
  }

  getBordersOffset = (isFirst, isLast) => {
    const { tickness } = this.props.connectorsStyle

    if (!tickness) return {};

    let offsetDirection;
    if (isFirst) offsetDirection = this.isVertical() ? 'left' : 'top';
    else if (isLast) offsetDirection = this.isVertical() ? 'right' : 'bottom';
    else return {};
    return {
      [offsetDirection]: `calc(50% - ${tickness}px / 2)`
    }
  }

  renderNode = (node, index, isFirstNode, isLastNode, hasSibling) => {
    const { rootPosition, connectorsStyle } = this.props;
    const subtreeNodeStyle = hasSibling && (isFirstNode || isLastNode)
      ? {[`margin${capitalize(rootPosition)}`]: connectorsStyle.height} : {}
    return (
      <li
        className={classnames('Subtree', {
          'Subtree--first': isFirstNode && hasSibling,
          'Subtree--last': isLastNode && hasSibling
        })}
        key={index}
      >
        {hasSibling && (
          <div
            className='Subtree__Before'
            style={{
              ...this.getBordersStyle(isFirstNode, isLastNode),
              ...this.getBordersOffset(isFirstNode, isLastNode)
            }}
          />
        )}
        <div
          className="Subtree__Node"
          style={subtreeNodeStyle}
        >
          {index > 0 && !isFirstNode && !isLastNode && (
            <div
              className="Subtree__Node__Before"
              style={this.getBordersStyle()}
            />
          )}
          {
            node.element
            ? node.element
            : <div className="Subtree__Node__Content">{node.text}</div>
          }
          {node.children && (
            <div
              className="Subtree__Node__After"
              style={this.getBordersStyle()}
            />
          )}
        </div>
        {node.children && (
          <ul>
            {node.children.map(
              (child, childIndex, children) => this.renderNode(
                child,
                `${index}${childIndex}`,
                childIndex === 0,
                childIndex === children.length - 1,
                children.length > 1
              )
            )}
          </ul>
        )}
      </li>
    )
  }

  render() {
    return (
      <div className={`Tree Tree--${this.props.rootPosition.toLowerCase()}`}>
        <ul>
          {this.renderNode(this.props.data, 0, true, true, false)}
        </ul>
      </div>
    );
  }
}

export default Tree;
