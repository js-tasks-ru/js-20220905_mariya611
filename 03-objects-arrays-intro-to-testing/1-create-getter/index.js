/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const filds = path.split(".");                        //array

    return (obj) => {
        let copyObj = obj;
        for (const iterator of filds) {                      
            if (typeof copyObj[iterator] === "object") {
                copyObj = copyObj[iterator];
              } else {
                return copyObj[iterator]
              }
        }
    };
}
