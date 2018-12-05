# XVIZTableComponent (React Component)

The base component for rendering a Declarative UI
[table](https://github.com/uber/xviz/blob/master/docs/protocol-schema/declarative-ui.md#table) or
[treetable](https://github.com/uber/xviz/blob/master/docs/protocol-schema/declarative-ui.md#table)
component.

> Do not use this component directly unless implementing your own UI component. See
> [XVIZPanel](/docs/api-reference/xviz-panel) for how to render generic Declarative UI
> configurations.

## Properties

### UI Configuration

##### width (Number|String, optional)

The width of the video. Default `100%`.

##### height (Number|String, optional)

The height of the video. Default `400`.

##### style (Object, optional)

Custom CSS overrides. See [styling Table](https://github.com/uber-web/monochrome/blob/master/src/table/README.md#styling).

##### renderHeader (Function, optional)

Custom renderer for each column's header. Receives one argument with the following fields:

- `column` (Object) - the column definition
- `columnIndex` (Number) - the column index

Default: `({column}) => column.name`

##### renderCell (Function, optional)

Custom renderer for each cell. Receives one argument with the following fields:

- `value` (object) - the cell value
- `column` (object) - the column definition
- `columnIndex` (number) - the column index
- `row` (object) - the row definition
- `rowId` (string) - the row identifier

Default: `({value}) => value === null ? null : String(value)`

### Declarative UI Component Descriptor

The following props are automatically populated when this component is rendered via `XVIZPanel`. See
Declarative UI specification for details.

##### title (String)

##### description (String)

##### stream (String)

##### displayObjectId (Boolean)

### Log Info

The following props are automatically populated when this component is rendered via `XVIZPanel`.
Supply these props manually if the component is used without a `XVIZLoader` instance, e.g. connected
with a Redux store.

##### columns (Array)

See
[treetable columns spec](https://github.com/uber/xviz/blob/master/docs/protocol-schema/ui-primitives.md#treetable-columns)

##### nodes (Array)

See
[treetable nodes spec](https://github.com/uber/xviz/blob/master/docs/protocol-schema/ui-primitives.md#treetable-nodes-rows)