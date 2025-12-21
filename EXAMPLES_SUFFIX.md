# Examples with suffix

## Major Bump

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
          bump: major
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

| Previous Tag  | Updated Tag   |
| ------------- | ------------- |
| `v1.2.3`      | `v2.0.0-beta` |
| `v1.2.3-beta` | `v2.0.0-beta` |
| `null`        | `v1.0.0-beta` |

## Minor Bump

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
          bump: minor
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

| Previous Tag  | Updated Tag   |
| ------------- | ------------- |
| `v1.2.3`      | `v1.3.0-beta` |
| `v1.2.3-beta` | `v1.3.0-beta` |
| `null`        | `v0.1.0-beta` |

## Patch Bump

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
          bump: patch
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

| Previous Tag  | Updated Tag   |
| ------------- | ------------- |
| `v1.2.3`      | `v1.2.4-beta` |
| `v1.2.3-beta` | `v1.2.4-beta` |
| `null`        | `v0.0.1-beta` |
