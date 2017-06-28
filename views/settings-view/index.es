import React, { Component } from 'react'
import { Button, ButtonGroup, ButtonToolbar, Collapse } from 'react-bootstrap'
import FA from 'react-fontawesome'

import BookmarkDropdown from './bookmark-dropdown'
import ConfigMenu from './config-menu'
import ExportDropdown from './export-dropdown'

const { __, config } = window

export default class ShipInfoCheckboxArea extends Component {
  state = {
    scrollDown: false,
    menuShow: true,
  }

  componentDidMount = () => {
    window.addEventListener('scroll-top', this.handleScrollTopEvent)
    window.addEventListener('scroll-down', this.handleScrollDownEvent)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll-top', this.handleScrollTopEvent)
    window.removeEventListener('scroll-down', this.handleScrollDownEvent)
  }

  handleResetAll = () => {
    const { bounds } = config.get('plugin.ShipInfo', {})
    config.set('plugin.ShipInfo', {
      bounds,
    })
  }

  handleMenuOpen = (menuShow) => {
    if (menuShow === this.state.menuShow) return
    this.setState({ menuShow })
  }

  handleScrollTopEvent = () => {
    this.setState({
      scrollDown: false,
    })
  }

  handleScrollDownEvent = () => {
    this.setState({
      scrollDown: true,
    })
  }

  render() {
    const { menuShow, scrollDown } = this.state
    return (
      <div id="ship-info-settings">
        <div>
          <ButtonToolbar id="settings-toolbar">
            <ButtonGroup>
              <Button
                onClick={() => this.handleMenuOpen(!menuShow)}
                bsStyle={menuShow ? 'success' : 'default'}
              >
                <FA name="filter" style={{ marginRight: '1ex' }} />{__('Filter Setting')}
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button
                onClick={this.handleResetAll}
                id="reset-button"
              >
                <FA name="undo" style={{ marginRight: '1ex' }} />{__('Reset')}
              </Button>
              <BookmarkDropdown />
            </ButtonGroup>
            <ButtonGroup>
              <ExportDropdown />
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div>
          <Collapse in={menuShow && !scrollDown}>
            <div>
              <ConfigMenu />
            </div>
          </Collapse>
        </div>
      </div>
    )
  }
}
