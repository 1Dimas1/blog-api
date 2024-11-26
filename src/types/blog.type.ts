import {ObjectId} from "mongodb";

export type BlogDBType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type BlogOutPutType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type URIParamsBlogIdType = {
    id: string,
}