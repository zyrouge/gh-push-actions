# Github Push Action

🚀 Easy to use GitHub Push Action!

[![Latest Version](https://img.shields.io/github/v/release/zyrouge/github-push-action?logo=github&label=github-marketplace)](https://github.com/marketplace/actions/github-push-action)

## Usage

```yaml
- uses: zyrouge/github-push-action@v1
  with:
      directory: dist
      branch: gh-pages
```

## Options

| Option               | Description                                 | Default                                        |
| -------------------- | ------------------------------------------- | ---------------------------------------------- |
| `github-token`       | GitHub or PAT Token                         | `${{ github.token }}`                          |
| `repository`         | GitHub Repository (format: `username/repo`) | `${{ github.repository }}`                     |
| `branch`             | Repository Branch                           | `${{ github.ref_name }}`                       |
| `force`              | Determines if force push is used            | `false`                                        |
| `directory`          | Directory to be pushed                      | `.`                                            |
| `commit-message`     | Commit message                              | `[actions] Pushed from ${{ github.sha }}`      |
| `local-username`     | Git Local Username                          | `github-actions`                               |
| `local-email`        | Git Local Email                             | `${{ github.actor }}@users.noreply.github.com` |
| `verbose`            | Verbose logging                             | `false`                                        |
| `allow-empty-commit` | Determines if empty commits are allowed     | `false`                                        |
| `skip-fetch`         | Allows skipping git fetch                   | `false`                                        |

## Example

Check out [test.yml](./.github/workflows/test.yml).
