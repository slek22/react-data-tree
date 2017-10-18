import React, { Component } from 'react';
import classnames from 'classnames';
import { oneOf, oneOfType, arrayOf, shape, number, string, node } from 'prop-types';

import { TOP, RIGHT, BOTTOM, LEFT, DEFAULT_CONNECTORS_STYLE } from './constants';
import { capitalize, lazyFunction } from './utils';

import './styles.scss';

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
    nodesClassName: string,
    connectorsStyle: shape({
      tickness: number,
      color: string,
      radius: number,
      height: number
    }),
    data: nodeShape.isRequired
  }

  static defaultProps = {
    rootPosition: TOP,
    nodesClassName: ''
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
      case RIGHT:
        return isFirst ? 'TopRight' : 'BottomRight';
      case BOTTOM:
        return isFirst ? 'BottomLeft' : 'BottomRight';
      case LEFT:
        return isFirst ? 'TopLeft' : 'BottomLeft';
      default:
        return isFirst ? 'TopLeft' : 'TopRight'
    }
  }

  getBordersStyle = (isFirst, isLast, style) => {
    const { tickness, color, radius, height } = style;
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

  getBordersOffset = (isFirst, isLast, style) => {
    let offsetDirection;
    if (isFirst) offsetDirection = this.isVertical() ? 'left' : 'top';
    else if (isLast) offsetDirection = this.isVertical() ? 'right' : 'bottom';
    else return {};
    return {
      [offsetDirection]: `calc(50% - ${style.tickness}px / 2)`
    }
  }

  renderNode = (node, index, isFirstNode, isLastNode, hasSibling, nodesClassName, style) => {
    const { rootPosition } = this.props;
    const subtreeNodeStyle = hasSibling && (isFirstNode || isLastNode)
      ? {[`margin${capitalize(rootPosition)}`]: style.height} : {}
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
              ...this.getBordersStyle(isFirstNode, isLastNode, style),
              ...this.getBordersOffset(isFirstNode, isLastNode, style)
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
              style={this.getBordersStyle(false, false, style)}
            />
          )}
          {
            node.element
            ? node.element
            : (
              <div className={`Subtree__Node__Content ${nodesClassName}`}>
                {node.text}
              </div>
            )
          }
          {node.children && (
            <div
              className="Subtree__Node__After"
              style={this.getBordersStyle(false, false, style)}
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
                children.length > 1,
                nodesClassName,
                style
              )
            )}
          </ul>
        )}
      </li>
    )
  }

  render() {
    const { rootPosition, data, nodesClassName, connectorsStyle } = this.props;
    return (
      <div className={`Tree Tree--${rootPosition}`}>
        <ul>
          {this.renderNode(
            data,
            0,
            true,
            true,
            false,
            nodesClassName,
            {
              ...DEFAULT_CONNECTORS_STYLE,
              ...connectorsStyle
            }
          )}
        </ul>
      </div>
    );
  }
}

export default Tree;
