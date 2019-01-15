let rawData = [[1, 2, [3]], 4];

// let result = [];

// function flatten(arr) {
//     arr.forEach(element => {
//         if (Array.isArray(element))
//             flatten(element);
//         else
//             result.push(element);
//     });
// }

function flatten(items) {
    function pushToArray(arr) {
        arr.forEach(element => {
            if (Array.isArray(element))
                pushToArray(element);
            else
                result.push(element);
        });
    }

    let result = [];
    pushToArray(items);

    return result
}

let result = flatten(rawData);

console.log(result);