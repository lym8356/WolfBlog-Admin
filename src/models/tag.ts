

export interface Tag {
    type: "tag";
    id: number;
    title: string;
}

export interface TagFormValues {
    id?: number;
    title: string;
}

// export class Tag implements Tag {
//     constructor(init?: TagFormValues) {
//         Object.assign(this, init);
//     }
// }

// export class TagFormValues {
//     id?: number = undefined;
//     title: string = '';

//     constructor(tag?: TagFormValues){
//         if(tag) {
//             this.id = tag.id;
//             this.title = tag.title;
//         }
//     }
// }