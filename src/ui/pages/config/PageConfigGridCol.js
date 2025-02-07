import React from 'react';
import PropTypes from 'prop-types';

import PageConfigGridRow from 'ui/pages/config/PageConfigGridRow';
import DroppableEmptyFrame from 'ui/pages/config/DroppableEmptyFrame';
import DraggableWidgetFrame from 'ui/pages/config/DraggableWidgetFrame';
import DroppableWidgetFrame from 'ui/pages/config/DroppableWidgetFrame';
import { WIDGET_STATUS_REMOVED } from 'state/page-config/const';


export const ROW_HEIGHT = 80;


const PageConfigGridCol = ({ cellMap, cellKey, gridWidth }) => {
  const col = cellMap[cellKey];
  const childrenRows = Object.keys(cellMap)
    .map(key => cellMap[key])
    .filter(cell => cell.parentKey === cellKey);


  const width = (col.x2 - col.x1) + 1;
  const height = (col.y2 - col.y1) + 1;
  const pcWidth = ((width / gridWidth) * 100);

  const classNameAr = ['PageConfigGridCol'];
  let content;
  if (childrenRows.length) {
    // this col contains nested rows
    classNameAr.push('PageConfigGridCol--container');
    content = childrenRows.map(row => (
      <PageConfigGridRow
        key={row.key}
        cellMap={cellMap}
        cellKey={row.key}
        gridWidth={width}
      />
    ));
  } else if (!Number.isInteger(col.framePos)) {
    // this col does not contain a frame
    classNameAr.push('PageConfigGridCol--hole');
    content = null;
  } else if (col.widgetCode) {
    const DecoratedWidgetFrame =
      (col.widgetStatus === WIDGET_STATUS_REMOVED) ? DroppableWidgetFrame : DraggableWidgetFrame;

    // this col contains a frame with a widget
    classNameAr.push('PageConfigGridCol--frame');
    content = (
      <DecoratedWidgetFrame
        widgetAction={col.widgetAction}
        frameId={col.framePos}
        frameName={col.frameDescr}
        frameIsMainFrame={col.frameIsMainFrame}
        widgetId={col.widgetCode}
        widgetName={col.widgetTitle}
        widgetHasConfig={col.widgetHasConfig}
        widgetStatus={col.widgetStatus}
        widgetHasConfigForm={col.widgetHasConfigForm}
      />
    );
  } else {
    // this col contains an empty frame
    classNameAr.push('PageConfigGridCol--frame');
    content = (
      <DroppableEmptyFrame
        frameId={col.framePos}
        frameName={col.frameDescr}
        frameIsMainFrame={col.frameIsMainFrame}
      />
    );
  }

  return (
    <div
      key={`col-${col.x1}`}
      style={{ minHeight: ROW_HEIGHT * height, width: `${pcWidth}%` }}
      className={classNameAr.join(' ')}
    >
      { content }
    </div>
  );
};


PageConfigGridCol.propTypes = {
  cellMap: PropTypes.objectOf(PropTypes.shape({
    x1: PropTypes.number.isRequired,
    x2: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
    y2: PropTypes.number.isRequired,
    framePos: PropTypes.number,
    widgetCode: PropTypes.string,
    widgetStatus: PropTypes.string,
    widgetAction: PropTypes.string,
    frameDescr: PropTypes.string,
    widgetTitle: PropTypes.string,
    widgetHasConfig: PropTypes.bool,
    widgetHasConfigForm: PropTypes.bool,
    frameIsMainFrame: PropTypes.bool,
    frame: PropTypes.shape({
      descr: PropTypes.string.isRequired,
      pos: PropTypes.number.isRequired,
    }),
    widget: PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      hasConfig: PropTypes.bool.isRequired,
    }),
  })).isRequired,
  cellKey: PropTypes.string.isRequired,
  gridWidth: PropTypes.number,
};

PageConfigGridCol.defaultProps = {
  gridWidth: 12,
};

export default PageConfigGridCol;
