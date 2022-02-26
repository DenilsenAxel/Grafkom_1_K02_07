export const multiplyMatrix = (mat1: number[], mat2: number[]) => {
    const matrixResult : Array<number> = [];

    for(let i = 0; i < 3; ++i) {
        for(let j = 0; j < 3; ++j) {
            let temp = 0;
            for(let k = 0; k < 3; ++k) {
                temp += mat1[i * 3 + k] * mat2[k * 3 + j];
            }
            matrixResult.push(temp);
        }
    }
    
    return matrixResult;
};

export const convertPosToClip = (x: number, y: number, bounding: DOMRect) => {
    return {
        x: 2 * ((x - bounding.left) / bounding.width) - 1,
        y: -2 * ((y - bounding.top) / bounding.height) + 1
    }
}

export const convertColorString = (hex: string) => {
    var chunks = [];
    var tmp;
    hex = hex.substring(1); // remove the pound 
    if ( hex.length === 3){
        tmp = hex.split("");
        for(let i = 0; i < 3; i++){
            chunks.push(parseInt(tmp[i]+""+tmp[i],16)/256);
        }
    }else if (hex.length === 6){
        tmp = hex.match(/.{2}/g) as RegExpMatchArray;
        for(let i = 0; i < 3; i++){
            chunks.push(parseInt(tmp[i],16)/256);
        }
    }

    return [...chunks, 1.0];
}

export const IdentityMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]