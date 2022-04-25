# GH Push Actions

🚀 Easy to use GitHub Push Action!

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

## Usage

```yaml
uses: zyrouge/gh-push-action@v1.0.1
with:
    directory: dist
    branch: gh-pages
```
