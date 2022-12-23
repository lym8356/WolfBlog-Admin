

export interface Category {
    type: "category";
    id: number;
    title: string;
}

export interface CategoryFormValues {
    id?: number;
    title: string;
}

// export class Category implements Category {
//     constructor(init?: CategoryFormValues) {
//         Object.assign(this, init);
//     }
// }


// export class CategoryFormValues {
//     id?: number = undefined;
//     title: string = '';

//     constructor(category?: CategoryFormValues){
//         if(category) {
//             this.id = category.id;
//             this.title = category.title;
//         }
//     }
// }