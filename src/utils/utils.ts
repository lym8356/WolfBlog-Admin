import { Article } from "../models/Article";

/**
 * check if arr1 contains all elements in arr2
 * @param {Array} arr1
 * @param {Array} arr2 
 * @returns {Boolean}
 */

export const isContained = (arr1: Array<string>, arr2: Array<string>) => {
    if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) return false;
    // length of arr being searched must be greater than or equal 
    if (arr1.length < arr2.length) return false;
    for (let i=0; i<arr2.length; i++){
        if(!arr1.includes(arr2[i])) return false;
    }
    return true;
}