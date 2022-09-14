/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if(size === 0){
        return ''
    }
    if( !size){
        return string
    }

    let stringArr = string.split('')
    let newStringArr =[]
    let currentSymbol = ''
    let currentNuber=1  // 
    for (let i = 0; i < stringArr.length; i++) {
        if(stringArr[i] === currentSymbol){
            if(currentNuber===size){
                continue;
            } else{
                newStringArr.push(stringArr[i])
                currentNuber +=1
            }
        } else {
            newStringArr.push(stringArr[i])
            currentSymbol = stringArr[i]
            currentNuber=1
        }
    }

    return newStringArr.join('')
}
