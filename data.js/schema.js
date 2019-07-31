import {importSchema} from 'graphql-import'

const typeDefs = importSchema('data.js/schema.graphql');

export {typeDefs}