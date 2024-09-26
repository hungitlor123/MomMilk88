export interface ICategory {
    id: string;
    name: string;
    targetAudience: string;
    ageRange: string;
    milkType: string;
    icon: string;
}
export interface ICategoryCreate {
    name: string;
}
export interface ICategoryRename {
    id: string;
    name: string;
    targetAudience: string;
    ageRange: string;
    milkType: string;
    icon: string;
}