// let data = {
//     name : 'Juhan library',
//     address : 'Incheon',
//     since : 2000,
//     books : [
//       {name : 'Herry Poter', status : 'O'},
//       {name : 'Herry Poter', status : 'X'},
//     ]
// }

export type Information = {
    name : string;
    address : string;
    since : number;
    books : Book[];
}

export type Book = {
    name : string;
    status: string;
}
