import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import '../../css/Menu.css';
import {SocketContext} from '../socket.io';

/**
 * MenuTab - the menu tab component.
 * @param {object} props
 * @return {JSX.Element}
 */
const MenuTab = (props) => {
  // css styling.
  const classesTitleText = props.active ?
    'menu-title menu-active' : 'menu-title';
  /**
   * Renders the React component.
   * @return {JSX.Element} - React markup for component.
   */
  return (
    <div className='menuTab'>
      <div className={classesTitleText}
        onClick={props.onClick}>
        {props.title}
      </div>
    </div>
  );
};
MenuTab.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.bool,
};

/**
 * Menu - the menu component.
 * @param {object} props
 * @return {JSX.Element}
 */
const Menu = (props) => {
  const socketContext = useContext(SocketContext);
  const [connected, setConnected] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (socketContext) {
      socketContext.on('connect', () => {
        setReason('');
        setConnected(true);
      });
      socketContext.on('disconnect', (reason) => {
        setReason(reason);
        setConnected(false);
      });
    }
  }, [socketContext]);
  /**
   * Renders the React component.
   * @return {JSX.Element} - React markup for component.
   */
  return props.visible ? (
    <div className='root'>
      <div className='menu'>
        { props.tabs.map((tab, index) => (
          <MenuTab
            key={index}
            index={index}
            length={props.tabs.length}
            title={tab.title}
            onClick={tab.onClick}
            active={index === props.activeTab}
            activeIndex={props.activeTab}
          />
        ))}
      </div>
      {!connected && (
        <div className="alert alert-warning" role="alert">
          Disconnected from Python <br />{reason}
        </div>
      )}
    </div>
  ) : null;
};
Menu.defaultProps = {
  activeTab: 0,
};
Menu.propTypes = {
  visible: PropTypes.bool,
  tabs: PropTypes.array,
  activeTab: PropTypes.number,
};

export default Menu;
