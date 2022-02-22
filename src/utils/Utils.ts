export const multiplyMatrix = (mat1: number[], mat2: number[]) => {
    const result = [];

    let length1 = Math.pow(mat1.length,0.5);
    let length2 = Math.pow(mat2.length,0.5);

    let row1=3;
    let row2=3;
    let col1=3;
    let col2=3;


    for (let i = 0; i < row1; i++) {
        for (let j = 0; j < col2; j++) {
            let sum = 0;
            for (let k = 0; k < col1; k++)
                sum = sum + mat1[i * col1 + k] * mat2[k * col2 + j];
            result[i * col2 + j] = sum;
        }
    }
    return result;
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