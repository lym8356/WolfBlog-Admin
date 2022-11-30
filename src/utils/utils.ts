
export const findMaxID = (objList : any) => {
    let maxID = 0;
    objList.forEach((element: { id: number; }) => {
        if (element.id > maxID) {
            maxID = element.id;
        }
    });
    return maxID;
}