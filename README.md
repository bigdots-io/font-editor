# BigDots Editor

The editor for building fonts and macros.

It is recommended that you have `macro-library` cloned and `npm link`ed before you clone the Editor. When you clone the editor, `npm link macro-library`. Clone these projects so the directory structure looks like...

```
/macro-library
/typewriter
/editor
```

## Starting up

`gulp`
`npm start`

The editor will update js when any edits are made in `macro-library`, so just refresh to see your changes when working on a macro.

The editor will write font config to `/typewriter` for the appropriate font.
