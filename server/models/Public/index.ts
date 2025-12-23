// import {
//     TAlgorithmCategoryFilters,
//     TAlgorithmCategory,
//     TAlgorithm,
//     AlgorithmCategoryIdsProps,
// } from "../../public/controllers/category/category.types";
// import {
//     AlgorithmCategoryModel,
//     AlgorithmModel,
//     AlgorithmCategoryIdsModel,
//     IndicatorModel
// } from "database/models";

// export class Public {
//     constructor() { }

//     public async getAlgorithmCategoryList(
//         filters: TAlgorithmCategoryFilters
//     ): Promise<TAlgorithmCategory | any> {
//         const total = await AlgorithmCategoryModel.count();
//         const data = await AlgorithmCategoryModel.findAll({
//             offset: filters.offset,
//             limit: filters.limit,
//         });
//         return { total, data };
//     }

//     public async getFeaturedAlgorithms(): Promise<TAlgorithm[] | any> {
//         const data = await AlgorithmModel.findAll({
//             limit: 3,
//         });
//         return data;
//     }

//     public async getAlgorithmCategoryById(
//         id: number
//     ): Promise<TAlgorithmCategory | any> {
//         const data = await AlgorithmCategoryModel.findAll({
//             where: {
//                 id,
//             },
//         });
//         return data ? data[0] : null;
//     }

//     public async getAlgorithmCategoryByUri(
//         uri: string
//     ): Promise<TAlgorithmCategory | any> {
//         const data = await AlgorithmCategoryModel.findOne({
//             where: {
//                 uri,
//             },
//         });
//         return data ?? null;
//     }

//     public async getAlgorithmByUri(
//         uri: string
//     ): Promise<TAlgorithmCategory | any> {
//         const data = await AlgorithmModel.findOne({
//             where: {
//                 uri,
//             },
//         });
//         return data ?? null;
//     }

//     public async getAlgorithmsByCategoryId(
//         categoryId: number
//     ): Promise<AlgorithmCategoryIdsProps | any> {
//         const d = await AlgorithmCategoryIdsModel.findAll({
//             where: {
//                 categoryId,
//             },
//         });

//         return d;
//     }

//     public async getAlgorithmByAlgorithmIds(
//         algorithmIds: number[]
//     ): Promise<TAlgorithm | any> {
//         const data = await AlgorithmModel.findAll({
//             where: {
//                 id: algorithmIds,
//                 available_for_trial: true,
//                 status: 'active'
//             },
//             attributes: ["image", "id", "name", "description", "type", "uri"],
//         });
//         return data;
//     }

//     public async getPlanAlgorithms(
//         algorithmIds: number[]
//     ): Promise<TAlgorithm | any> {
//         const data = await AlgorithmModel.findAll({
//             where: {
//                 id: algorithmIds,
//                 status: 'active'
//             },
//             attributes: ["image", "id", "name", "description", "type", "uri"],
//         });
//         return data;
//     }

//     public async getCategoryAlgorithm(
//         categoryId: number,
//         algorithmId: number
//     ): Promise<AlgorithmCategoryIdsProps | any> {
//         const d = await AlgorithmCategoryIdsModel.findAll({
//             where: {
//                 categoryId,
//                 algorithmId,
//             },
//         });

//         return d ?? null;
//     }

//     public async getDiscoverCategory(): Promise<TAlgorithmCategory | any> {
//         const data = await AlgorithmCategoryModel.findOne({
//             where: {
//                 name: "Discover",
//             },
//         });
//         if (data) return data;
//         const category = await AlgorithmCategoryModel.findOne({
//             order: [["createdAt", "DESC"]],
//         });
//         return category ?? null;
//     }

//     public async getAlgorithmCategories(
//         id: number
//     ): Promise<AlgorithmCategoryIdsProps | any> {
//         const d = await AlgorithmCategoryIdsModel.findAll({
//             where: {
//                 algorithmId: id,
//             },
//         });

//         return d ?? null;
//     }

//     public async getCategoriesById(
//         id: number[]
//     ): Promise<TAlgorithmCategory[] | any> {
//         const d = await AlgorithmCategoryModel.findAll({
//             where: {
//                 id,
//             },
//         });

//         return d ?? null;
//     }

//     public async getPublicRoutes(): Promise<any> {
//         const categories = await AlgorithmCategoryModel.findAll({
//             attributes: ["uri"],
//         });

//         const category_algorithmns = await AlgorithmModel.findAll({
//             attributes: ["uri"],
//         });
//         return { categories, category_algorithmns };
//     }

//     public async getAlgorithmDetailById(
//         id: string
//     ): Promise<TAlgorithmCategory | any> {
//         const data = await AlgorithmModel.findOne({
//             where: {
//                 id,
//             },
//         });
//         return data ?? null;
//     }

//     public async getAlgorithmIndicators(
//         ids: string[]
//     ): Promise<any> {
//         const d = await IndicatorModel.findAll({
//             where: {
//                 id: ids,
//             },
//         });
//         return d ?? null;
//     }
// }
