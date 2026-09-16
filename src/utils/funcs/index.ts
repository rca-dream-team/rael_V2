/**
 * function that takes a key string like 'name' or 'name.first' and returns a function that takes an object and returns the value of the key in the object
 * @param key - the key to get the value of
 * @param obj - the object to get the value from
 */
export const getObjValue = (key: string | number, obj: any) => {
   const keys = key.toString().split('.');
   let result = obj;
   for (const key of keys) {
      if (result && Object.prototype.hasOwnProperty.call(result, key)) {
         result = result[key];
      } else {
         return undefined;
      }
   }
   return result as string;
};

/**
 * @param str
 * @returns a capitalize string ex: 'HELLO_WORLD' => 'Hello World'
 */
export const capitalize = (str: string): string => {
   if (!str) return '';
   return str
      ?.split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
};

/**
 * @param data
 * @param cols
 * @returns
 * @description Make a 2D array with the given data and number of columns and equal rows in columns
 */
export const putDataInCols = <T = any>(data: T[], cols: number): T[][] => {
   //console.log('put in cols data', data);
   const rows = Math.ceil(data.length / cols);
   const result: T[][] = [];
   for (let i = 0; i < rows; i++) {
      result.push(data.slice(i * cols, i * cols + cols));
   }
   const final: T[][] = reverse2DArray(result);
   //console.log('final', final);
   return final;
};

export function reverse2DArray<T = any>(array: T[][]) {
   const numRows = array.length;
   const numCols = array[0].length;

   // Create a new array with reversed dimensions
   const reversedArray = new Array(numCols);
   for (let i = 0; i < numCols; i++) {
      reversedArray[i] = new Array(numRows);
   }

   // Copy values from the original array to the reversed array
   for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
         // if (!array[i][j]) {
         //   continue;
         // }
         reversedArray[j][i] = array[i][j];
      }
   }

   return reversedArray;
}
