[![version number](https://vsmarketplacebadge.apphb.com/version-short/pawijs.vscode-pawi.svg)](https://marketplace.visualstudio.com/items?itemName=pawijs.vscode-pawi)
[![install count](https://vsmarketplacebadge.apphb.com/installs-short/pawijs.vscode-pawi.svg)](https://marketplace.visualstudio.com/items?itemName=pawijs.vscode-pawi)

# Visual Live Coding for VSCode

![vscode-firstTreeBuild](https://user-images.githubusercontent.com/79422935/110322560-2e879380-8078-11eb-97d1-bb8e02bbf9fc.gif)

[Pawi](http://pawijs.org/) is a set of tools, libraries and editor helpers to make
the creation of delicate and complex visuals simpler and faster by enabling:

1. Code reuse (once a block is created, it can easily be reused in new projects)
2. Code sharing (publishing blocks as npm package for others to use)
3. Stability (library versions locked with npm, versioning)
4. Fast feedback loop (live coding, visual programming)

The project uses the latest web technologies and tries to have the lowest possible
impact on performance (typically equivalent to a function call).

## How does it work ?

The extension displays the visual programming view when opening a "pawi"
branch definition (named `[name].o.json`). All files in the project and the
project's direct dependencies named `[name].o.ts` are loaded as library items.

See the [sample project](https://github.com/pawijs/sample-project) for an example
on how to configure a project.

## Extension Settings

The extension does not have any settings yet.

## Known Issues

The project is in "alpha" stage with potentially lots of moving parts, please join the
discussion on the [repository](https://github.com/pawijs/pawi) if you have any questions
or wish to contribute ideas, documentation or features.

## Release Notes

### [1.0.0] - 2021-03-09

Initial release, very early prototype.

---

# Build

The extension requires the 'vscode-view' app to build first inside the pawi monorepo.
