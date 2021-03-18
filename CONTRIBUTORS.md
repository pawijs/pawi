These are some notes for maintainers.

# Contributions

Make sure you have prettier enabled while working on source code. Ask to join
team (so you can push PR directly to repo), create a PR, push it, make the
pull request, tell us to review :-).

Always start work on latest code in `next` branch.

# Building with latest @forten

The proper way to work in parallel with lates `forten` modules is to do a
bindfs:

Provided both `forten` and `pawi` live in the same folder:

```bash
mkdir -p pawi/packages/node_modules/@forten
bindfs forten/packages/@forten pawi/packages/node_modules/@forten
# To remove bind
umount pawi/packages/node_modules/@forten
```

What this does is make the filesystem really believe the files are there and
thus avoid some confusion (things like proxy errors are typical signs of such
confusion because multiple versions of Overmind a bundled).

Be careful: any change or file remove in this `@forten` folder acts on
original files.

PS: If anyone manages to have `workspaceRoot` or similar working for snowpack so we
have file watch and reloading, this would be AWESOME :-) !!

# Release process

Review and merge PRs into `next` branch. To release a production ready version, you need
to add the commits from `next` to `main` with the following (github web interface does not
work as it makes branches diverge):

```sh
$ git checkout next
$ git pull
$ npm install # make sure any new dependencies are installed
$ npm install --no-save nodegit # needed to test release
$ npm run release -- --dry-run # and check release notes
$ git checkout main
$ git pull
$ git merge --ff-only next
$ git push
```
