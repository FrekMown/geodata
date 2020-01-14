import React from 'react';
import './IndicatorItems.css';

export const IndicatorInactiveItem = (props) => (
  <div id="IndicatorInactiveItem" 
    onClick={()=>props.setSelIndicator(props.indicator.id)}
    style={props.active ? {backgroundColor: "darkblue", color: "wheat"} : {}}
  >
    <div id="indicator-inactive-id">{props.indicator.id}</div>
    <div id="indicator-inactive-name">{props.indicator.name}</div>
  </div>
)

export const IndicatorActiveItem = (props) => (
  <div id="IndicatorActiveItem">
    <div id="indicator-active-id">{props.indicator.id}</div>
    <div id="indicator-active-name">{props.indicator.name}</div>
    <div id="indicator-active-sourceNote">{props.indicator.sourceNote}</div>
  </div>
)