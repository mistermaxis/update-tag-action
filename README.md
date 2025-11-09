
# Update Tag Action

## Grab the latest tag in your repository and update it

### An action to update version tag using semantic versioning

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

### Inputs

- `bump`: the type of increase to be made. Can be major, minor, patch, prerelease or none. Defaults to `none`, Not required

- `prefix`: prefix to use before the version number. It could be any string. Defaults to `v`. Not required

- `suffix`: suffix to use after the version number. Usually for prereleases. Defaults to empty string: `''`

- `copy_from`: Whether the tag should copy the version number and update the suffix. Eg: ```v1.2.3-beta -> v1.2.3``` To be used in conjunction with `bump:none` and target_suffix. Not required

- `target_suffix`: The target suffix to assign to the tag in place of the source one. Eg ```alpha -> beta or beta -> ''```

### Outputs

- `updated_tag`: The newly composed tag (this action doesn't create the tag itself. It just creates the formatted tag string and provides it as an output)

## Methodology

### bump: prerelease

### prefix: v

### suffix: beta

## Searching for a tag where the bump is prerelease

### Expected result

Search for all the prerelease tags with the provided suffix (eg:
`vx.y.z-beta.w`), pick the highest

If no prerelease is found with the provided suffix, search for all tags
with supplied suffix (eg: `vx.y.z-beta`), pick the highest

If no tag is found with that suffix, search for all valid tags without
any prefix (eg: `vx.y.z`), pick the highest

If no valid tag is found at all, use the default `v0.0.0`

## Updating a tag where the bump is prerelease

### Expected result

If the tag is in the form `vx.y.z-beta.w`, grab the `w` (prerelease) component and
increase it by one. Construct the tag back with the updated components
and return the tag. Eg: `v1.2.3-beta.2 → v.1.2.3-beta.3`

If the tag is in the form `vx.y.z-beta`, increase the `y` (minor)
component by one, set the `z`(patch) component to `0` and construct the
tag again with the updated components and add `1` as prerelease number.
Eg: v`1.2.3-beta → v1.3.0-beta.1`

If the tag is in the form `vx.y.z`, increase the `y` (minor) component by
one, set the `z` (patch) component to zero and construct the tag again
with the updated components and add the suffix and `1` as prerelease
number. Eg: `v1.2.3 → v1.3.0-beta.1`

### bump: patch

### prefix: v

### suffix: beta

## Searching for a tag where the bump is patch

### Expected result:

Search for all tags with the provided suffix (eg: `x.y.z-beta`), pick the
highest

If no tag is found with that suffix, search for all valid tags without
any prefix (eg: x.y.z), pick the highest

If no valid tag is found at all, use the default 0.0.0

Updating a tag where the bump is patch

Expected result:

If the tag is in the form (v)x.y.z-beta, increase the patch (z)
component by one and construct the tag again with the updated
components. Eg: v1.2.3-beta → v1.2.4-beta

If the tag is in the form (v)x.y.z, increase the patch (z) component by
one, and construct the tag again with the updated components and add the
suffix. Eg: v1.2.3 → v1.2.4-beta

bump: minor

prefix: v

suffix: null

Searching for a tag where the bump is minor

Expected result:

Search for all tags with the provided suffix (eg: x.y.z-beta), pick the
highest

If no tag is found with that suffix, search for all valid tags without
any prefix (eg: x.y.z), pick the highest

If no valid tag is found at all, use the default 0.0.0

Updating a tag where the bump is minor

Expected result:

If the tag is in the form (v)x.y.z-beta, increase the minor (y)
component by one, set the patch (z) component to zero and construct the
tag again with the updated components. Eg: v1.2.3-beta → v1.3.0-beta

If the tag is in the form (v)x.y.z, increase the major (x) component by
one, set the minor (y) and patch (z) components to zero and construct
the tag again with the updated components and add the suffix. Eg: v1.2.3
→ v1.3.0-beta

bump: major

prefix: v

suffix: null

Searching for a tag where the bump is major

Expected result:

Search for all tags with the provided suffix (eg: x.y.z-beta), pick the
highest

If no tag is found with that suffix, search for all valid tags without
any prefix (eg: x.y.z), pick the highest

If no valid tag is found at all, use the default 0.0.0

Updating a tag where the bump is major

Expected result:

If the tag is in the form (v)x.y.z-beta, increase the major (x)
component by one, set the minor (y) and patch (z) components to zero and
construct the tag again with the updated components. Eg: v1.2.3-beta →
v2.0.0-beta

If the tag is in the form (v)x.y.z, increase the major (x) component by
one, set the minor (y) and patch (z) components to zero and construct
the tag again with the updated components and add the suffix. Eg: v1.2.3
→ v2.0.0-beta

v1.2.0-beta.1 → v1.2.0-beta

v0.4.0-alpha → v0.4.0-beta
