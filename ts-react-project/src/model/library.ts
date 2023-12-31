export type Data = {
    name : string;
    address : string;
    since : number;
    books : Book[]
}

export type Book = {
    name : string;
    status : string;
}