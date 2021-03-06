We make a difference between 'mutations' and 'operations' so that we have a
good understanding of calling hierarchy.

## 1. Actions

Actions analyse context and trigger 1 mutation

Actions cover all use cases with tests for each situation. Not more nor less.

## 2. Mutations

Mutations trigger operations and correspond to one event (aka action). A mutation does all the job, including changing selection.

## 3. Operations

Operations do part of the job, triggering other operations if needed. They do
not execute 'cleanup' tasks such as sortedId update or selection updtae.
These trigger hooks.

## Helpers

Helpers do not mutate state.

They must behave perfectly (no special case missed, no undefined unchecked,
etc).

# Testing

We use a well defined testing strategy to ensure both long term editor
consistency and avoid test duplication and boilerplate at each level.

We only test Actions and Helpers.

Actions are tested with before and after states. This testing strategy
ensures that we are not testing details of implementation but actual
behaviour. The test cases should be immutable as much as possible (we can add
new cases but we should not edit existing cases)

Since helpers do not mutate state, they cannot be tested with 'before/after'
strategy and are tested with unit tests. This is implementation specific and
tests are used to help development more than ensure editor sanity.

## "tum" format

This is how then input and output of mutations tests are defined.

At the top level we have paragraphs and data separated by `_`:

```
a_{"a": "some data for a"}
```

Each paragraph definition is separated by a '/':

```
a/b/c
```

Paragraph can contain the caret selection `|` or the start `[` of end `]` of a range selection:

```
hel|lo
hell[o world] my friend
```

The selection can span multiple paragraphs:

```
The s[tart/of a long/friends]hip
```

Some types can be set with prefix such as 'ol', 'ul' (lists), 'l', 'r' (columns) or 'B', 'I' (style). Lists and
columns only exist on root paragraphs, styles on sub-paragraphs.

```
a=some.B:bold.characters
```

Paragraphs can have additional options set with JSON directly after the content:

```
a{"c":"option for a"}/b/c{"c": "option for c"}
```

Group paragraphs are defined by having sub paragraph definitions after `=`

Each sub-paragraph is separated with a dot `.`.

```
a=a1.a2.a3
```

Sub paragraphs have the same rules as root paragraphs regarding JSON options and selections:

```
a=alfred{"x":"json for a1"}.an|na
```

If you can understand this one, you are good to exploring tests:

```
a/b=b[1{"t":"B"}.b2/c=c1.coo]l
```
