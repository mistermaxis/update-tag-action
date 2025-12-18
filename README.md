# Update Tag Action

## Grab the latest tag in your repository and update it

### An action to update a version tag using semver formatting

[![GitHub Super-Linter](https://github.com/mistermaxis/update-tag-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/mistermaxis/update-tag-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/mistermaxis/update-tag-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/mistermaxis/update-tag-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/mistermaxis/update-tag-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/mistermaxis/update-tag-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

### Inputs

| Name             | Type   | Default | Required | Description                                                                                                                                      |
| :--------------- | ------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bump`           | String | `none`  | false    | The type of bump. Can be major, minor, patch, prerelease or none. Defaults to `none`, Not required                                               |
| `prefix`         | String | `v`     | false    | Prefix to use before the version number. Defaults to `v`. Not required                                                                           |
| `suffix`         | String | `''`    | false    | suffix to use after the version number. Eg `v1.2.3-'beta'`                                                                                       |
| `replace_suffix` | String | `false` | false    | Whether the tag should copy the version number and update the suffix. Eg: `v1.2.3-beta -> v1.2.3` To be used in conjunction with `target_suffix` |
| `target_suffix`  | String | `''`    | false    | The target suffix to assign to the tag in place of the source one. Eg `alpha -> beta or beta -> ''`                                              |

### Outputs

> `updated_tag`: The newly composed tag (this action doesn't create the tag
> itself. It just creates the formatted tag string and provides it as an output)

## Example

```yaml
name: update-tag
on: push

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      - name: Create Release Tag
        id: release_tag
        uses: mistermaxis/update-tag-action@v2
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          bump: minor
      - name: Create Release
        uses: ncipollo/release-action@v1
        with:
          tag: ${{ steps.release_tag.outputs.updated_tag }}
          name: Release ${{ steps.release_tag.outputs.updated_tag }}
```

## Running the action with bump: prerelease

- **bump: prerelease**
- **prefix: v**
- **suffix: beta**

**Searching the tag:**

Search for all the prerelease tags with the provided `suffix` (eg:
`vx.y.z-beta.w`), pick the highest

If no prerelease is found, search for all tags with the supplied `suffix` (eg:
`vx.y.z-beta`), pick the highest

If no tag is found, search for all valid tags without any suffix (eg: `vx.y.z`),
pick the highest

If no valid tag is found at all, use the default `v0.0.0`

**Updating the tag:**

If the tag is in the form `vx.y.z-beta.w`, grab the `w` (prerelease) component
and increase it by one. Construct the tag back with the updated components and
return the tag. Eg: `v1.2.3-beta.2 → v.1.2.3-beta.3`

If the tag is in the form `vx.y.z-beta`, increase the `y` (minor) component by
one, set the `z`(patch) component to `0` and construct the tag again with the
updated components and add `1` as prerelease number. Eg:
v`1.2.3-beta → v1.3.0-beta.1`

If the tag is in the form `vx.y.z`, increase the `y` (minor) component by one,
set the `z` (patch) component to zero and construct the tag again with the
updated components and add the `suffix` and `1` as prerelease number. Eg:
`v1.2.3 → v1.3.0-beta.1`

## Running the action with bump: patch

- **bump: patch**
- **prefix: v**
- **suffix: beta | null**

**Searching the tag:**

Search for all tags with the provided `suffix` (eg: `vx.y.z-beta`), pick the
highest

If no tag is found, search for all valid tags without any suffix (eg: `vx.y.z`),
pick the highest

If no valid tag is found at all, use the default `v0.0.0`

**Updating the tag:**

If the tag is in the form `vx.y.z-beta`, increase the `z` (patch) component by
one and construct the tag again with the updated components. Eg:
`v1.2.3-beta → v1.2.4-beta`

If the tag is in the form `vx.y.z`, increase the `z` (patch) component by one,
and construct the tag again with the updated components and add the `suffix`, if
any. Eg: `v1.2.3 → v1.2.4` or `v0.3.6 → 0.3.7-beta`

## Running the action with bump: minor

- **bump: patch**
- **prefix: v**
- **suffix: beta | null**

**Searching the tag:**

Search for all tags with the provided `suffix` (eg: `vx.y.z-beta`), pick the
highest

If no valid tag is found, search for all valid tags without any suffix (eg:
`vx.y.z`), pick the highest

If no valid tag is found at all, use the default `v0.0.0`

**Updating the tag:**

If the tag is in the form `vx.y.z-beta`, increase the `y` (minor) component by
one, set the `z` (patch) component to zero and construct the tag again with the
updated components. Eg: `v1.2.3-beta → v1.3.0-beta`

If the tag is in the form `vx.y.z`, increase the `y` (minor) component by one,
set the `z` (patch) component to zero and construct the tag again with the
updated components and add the `suffix`, if any. Eg: `v1.2.3` `→ v1.3.0` or
`v4.8.3 → v4.9.0-beta`

## Running the action with bump: major

- **bump: patch**
- **prefix: v**
- **suffix: beta | null**

**Searching the tag:**

Search for all tags with the provided `suffix` (eg: `vx.y.z-beta`), pick the
highest

If no valid tag is found, search for all valid tags without any suffix (eg:
`vx.y.z`), pick the highest

If no valid tag is found at all, use the default `v0.0.0`

**Updating the tag:**

If the tag is in the form `vx.y.z-beta`, increase the `x` (major) component by
one, set the `y` (minor) and `z` (patch) components to zero and construct the
tag again with the updated components. Eg: `v1.2.3-beta →` `v2.0.0-beta`

If the tag is in the form `vx.y.z`, increase the `x` (major) component by one,
set the `y` (minor) and `z` (patch) components to zero and construct the tag
again with the updated components and add the `suffix`, if any. Eg: `v1.2.3`
`→ v2.0.0` or `v1.4.3 → v2.0.0-beta`

## Running the action with bump: none, and replace_suffix: true

- **bump: none**
- **prefix: v**
- **suffix: beta | null**
- **replace_suffix: true**

**Searching the tag:**

Search for all prerelease tags with the provided `suffix` (eg: `vx.y.z-beta.w`),
pick the highest

If no tag is found with a prerelease number, search for all valid tags with the
provided `suffix` (eg: `vx.y.z-beta`), pick the highest

If no valid tag is found, search for all valid tags without any suffix (eg:
`vx.y.z`), pick the highest

If no valid tag is found at all, use the default `v0.0.0`

**Updating the tag:**

If the tag is in the form `vx.y.z-beta.w`, Grab the tag and return it, removing
the prerelease component. Eg: `v1.2.3-beta.3 →` `v1.2.3-beta`

If the tag is in the form `vx.y.z-beta`, Grab the tag and return it as is. Eg:
`v1.2.3-beta → v1.2.3-beta`

If the tag is in the form `vx.y.z`, Grab the tag and append the `suffix`
component without modifying the tag. Eg: `v0.4.0 → v0.4.0-beta`

## Running the action with bump: none, replace_suffix: true and target_suffix: beta

- **bump: none**
- **prefix: v**
- **suffix: alpha**
- **replace_suffix: true**
- **target_suffix: beta**

**Searching the tag:**

Search for all tags with the provided `suffix` (eg: `vx.y.z-alpha`), pick the
highest

If no valid tag is found, search for all valid tags without any suffix (eg:
`vx.y.z`), pick the highest

If no valid tag is found at all, use the default `v0.0.0`

**Updating the tag:**

If the tag is in the form `vx.y.z-alpha`, Grab the tag and replace the `suffix`
with the `target_suffix`. Eg: `v1.2.3-alpha → v1.2.3-beta`

If the tag is in the form `vx.y.z`, Grab the tag and append the `target_suffix`
component without modifying the tag. Eg: `v0.4.0 → v0.4.0-beta`
