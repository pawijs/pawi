'use strict'

module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'test', name: 'test:     Adding missing tests' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    {
      value: 'refactor',
      name:
        'refactor: A code change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'chore',
      name:
        'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation',
    },
  ],

  scopes: [
  ],

  // it needs to match the value for field type. Eg.: 'fix'
  scopeOverrides: {
    chore: [],
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  appendBranchNameToCommitMessage: false,
}
