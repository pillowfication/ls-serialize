# ls-serialize

Serialize a directory.

## Install

```
npm install ls-serialize
```

## Example

```javascript
const ls = require('ls-serialize')

const dirString = ls.serialize(path.join(__dirname, 'test'))
// ROOT=test
// +level1
//  -file_1_a
//  -file_1_b
//  -file_1_c
//  +level2a
//   -file_2a_a
//   -file_2a_b
//  +level2b
//   -file_2b_a
//   -file_2b_b
//   +level3
//    -file_3_a

const dir = ls.deserialize(dirString)
// Directory { name: 'test',
//   'level1' => Directory { name: 'level1',
//     'file_1_a' => File { name: 'file_1_a' },
//     'file_1_b' => File { name: 'file_1_b' },
//     'file_1_c' => File { name: 'file_1_c' },
//     'level2a' => Directory { name: 'level2a',
//       'file_2a_a' => File { name: 'file_2a_a' },
//       'file_2a_b' => File { name: 'file_2a_b' } },
//     'level2b' => Directory { name: 'level2b',
//       'file_2b_a' => File { name: 'file_2b_a' },
//       'file_2b_b' => File { name: 'file_2b_b' },
//       'level3' => Directory { name: 'level3',
//         'file_3_a' => File { name: 'file_3_a' } } } } }
```
