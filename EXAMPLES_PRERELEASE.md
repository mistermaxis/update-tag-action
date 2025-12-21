# Examples with `bump: [premajor, preminor, prepatch]`

## Premajor Bump

```yaml
name: update-tag
on: push

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
      - name: Create Release Tag
        id: release_tag
        uses: mistermaxis/update-tag-action@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          bump: premajor
          prefix: v
          suffix: 'beta'
          # replace_suffix: false
          # new_suffix: undefined
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag    | Updated Tag     |
| --------------- | --------------- |
| `v1.2.3`        | `v2.0.0-beta.1` |
| `v1.2.3-beta`   | `v2.0.0-beta.1` |
| `v1.2.3-beta.4` | `v1.2.3-beta.5` |
| `null`          | `v1.0.0-beta.1` |

## Preminor Bump

```yaml
name: update-tag
on: push

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
      - name: Create Release Tag
        id: release_tag
        uses: mistermaxis/update-tag-action@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          bump: preminor
          prefix: v
          # suffix: ''
          # replace_suffix: false
          # new_suffix: undefined
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag    | Updated Tag     |
| --------------- | --------------- |
| `v1.2.3`        | `v1.3.0-beta.1` |
| `v1.2.3-beta`   | `v1.3.0-beta.1` |
| `v1.2.3-beta.4` | `v1.2.3-beta.5` |
| `null`          | `v0.1.0-beta.1` |

## Prepatch Bump

```yaml
name: update-tag
on: push

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
      - name: Create Release Tag
        id: release_tag
        uses: mistermaxis/update-tag-action@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          bump: prepatch
          prefix: v
          suffix: beta
          # replace_suffix: false
          # new_suffix: undefined
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag    | Updated Tag     |
| --------------- | --------------- |
| `v1.2.3`        | `v1.2.4-beta.1` |
| `v1.2.3-beta`   | `v1.2.4-beta.1` |
| `v1.2.3-beta.4` | `v1.2.3-beta.5` |
| `null`          | `v0.0.1-beta.1` |
