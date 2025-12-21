# Examples with edge cases

## The action fails if `replace_suffix` is true and `new_suffix` is undefined

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
          replace_suffix: true
          # new_suffix: undefined
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag | Result                                                                |
| ------------ | --------------------------------------------------------------------- |
| Any Tag      | `Error: A new_suffix must be defined when using replace_suffix: true` |

## The action fails if a prerelease bump is used and `suffix` is undefined

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

| Previous Tag | Result                                               |
| ------------ | ---------------------------------------------------- |
| Any Tag      | `Error: Prerelease bumps must be used with a suffix` |

## The action fails if a prerelease bump is used and `replace_suffix` is true

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
          suffix: beta
          replace_suffix: true
          # new_suffix: undefined
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag | Result                                                                               |
| ------------ | ------------------------------------------------------------------------------------ |
| Any Tag      | `Error: The flag replace_suffix: true is not meant to be used with prerelease bumps` |

## None bump with `suffix: alpha`, `replace_suffix: true` and `new_suffix: beta`

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
          suffix: alpha
          replace_suffix: true
          new_suffix: beta
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag   | Updated Tag   |
| -------------- | ------------- |
| `v1.2.3-alpha` | `v1.2.3-beta` |
| `v1.2.3-beta`  | `v0.0.0-beta` |
| `null`         | `v0.0.0-beta` |

## None bump with `suffix: beta`, `replace_suffix: true` and `new_suffix: ''`

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
          replace_suffix: true
          new_suffix: ''
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag   | Updated Tag |
| -------------- | ----------- |
| `v1.2.3-beta`  | `v1.2.3`    |
| `v1.2.3-alpha` | `v0.0.0`    |
| `null`         | `v0.0.0`    |

## None bump with `suffix: ''`, `replace_suffix: true` and `new_suffix: beta`

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
          suffix: ''
          replace_suffix: true
          new_suffix: beta
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag   | Updated Tag   |
| -------------- | ------------- |
| `v1.2.3`       | `v1.2.3-beta` |
| `v1.2.3-alpha` | `v0.0.0-beta` |
| `null`         | `v0.0.0-beta` |

## The action will pick the latest tag, with or without a suffix

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
          suffix: beta
          # replace_suffix: false
          # new_suffix: undefined
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

| Previous Tag          | Updated Tag   |
| --------------------- | ------------- |
| `v1.2.3, v2.3.4-beta` | `v3.0.0-beta` |
| `v1.2.3-beta, v2.3.4` | `v3.0.0-beta` |
| `null`                | `v1.0.0-beta` |

## The action will update the tag even if it has no prefix or suffix

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
          # prefix: ''
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
| `1.2.3`      | `2.0.0`     |
| `null`       | `1.0.0`     |
