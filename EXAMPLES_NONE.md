# Examples with `bump: none`

## None bump without suffix

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
          bump: none
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

| Previous Tag | Updated Tag |
| ------------ | ----------- |
| `v1.2.3`     | `v1.2.3`    |
| `null`       | `v0.0.0`    |

## None bump with suffix

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
          bump: none
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

| Previous Tag  | Updated Tag   |
| ------------- | ------------- |
| `v1.2.3-beta` | `v1.2.3-beta` |
| `null`        | `v0.0.0-beta` |

## None bump with prerelease number

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
          bump: none
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
| `v1.2.3-beta.1` | `v1.2.3-beta.1` |
| `null`          | `v0.0.0-beta`   |
