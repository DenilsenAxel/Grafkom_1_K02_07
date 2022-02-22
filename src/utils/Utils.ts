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

export const createIdentityMatrix = () => {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
};