// src/app.ts
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { createApplication } from "graphql-modules";

// src/infrastructure/env.ts
import { z } from "zod";
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.string().default("4000"),
});
var env = envSchema.parse(process.env);

// src/modules/aminoAcid/schema.ts
import { createModule } from "graphql-modules";
import * as url from "url";

// src/modules/aminoAcid/typeDef.ts
import { gql } from "graphql-modules";
var aminoAcidTypeDef = gql`
  type AminoAcid {
    id: Int!
    tryptophan: Float
    threonine: Float
    isoleucine: Float
    leucine: Float
    lysine: Float
    methionine: Float
    cystine: Float
    phenylalanine: Float
    tyrosine: Float
    valine: Float
    arginine: Float
    histidine: Float
    alanine: Float
    asparticAcid: Float
    glutamicAcid: Float
    glycine: Float
    proline: Float
    serine: Float
  }
`;
var typeDefs = [aminoAcidTypeDef];

// src/modules/aminoAcid/schema.ts
var __dirname = url.fileURLToPath(new URL(".", import.meta.url));
var aminoAcidModules = createModule({
  id: "amino-acid-module",
  dirname: __dirname,
  typeDefs,
});

// src/modules/category/schema.ts
import { createModule as createModule2 } from "graphql-modules";
import * as url2 from "url";

// src/infrastructure/primaClient.ts
import { PrismaClient } from "@prisma/client";
function getPrismaClient({ disableLogs } = {}) {
  let shouldLog = true;
  if (disableLogs === true) {
    shouldLog = false;
  }
  if (env.NODE_ENV === "production") {
    shouldLog = false;
  }
  const prisma = new PrismaClient({
    log: shouldLog ? ["error", "info", "query", "warn"] : void 0,
  });
  return prisma;
}

// src/modules/category/typeDef.ts
import { gql as gql2 } from "graphql-modules";
var categoryTypeDef = gql2`
  type Category {
    id: Int!
    name: String!
    foods: [Food]!
  }
`;
var queryTypeDef = gql2`
  input GetCategoryByIdOpts {
    foodFilters: PrismaQueryOptions
  }

  extend type Query {
    getAllCategories(opts: GetCategoryByIdOpts): [Category]!
    getCategoryById(id: Int!, opts: GetCategoryByIdOpts): Category
  }
`;
var typeDefs2 = [categoryTypeDef, queryTypeDef];

// src/modules/category/schema.ts
var __dirname2 = url2.fileURLToPath(new URL(".", import.meta.url));
var categoryModule = createModule2({
  id: "category-module",
  dirname: __dirname2,
  typeDefs: typeDefs2,
  resolvers: {
    Query: {
      getAllCategories: async (_, { opts }) => {
        return getPrismaClient().category.findMany({
          include: {
            foods: {
              ...opts.foodFilters,
              include: {
                nutrients: true,
                aminoAcids: true,
                category: true,
                fattyAcids: true,
              },
            },
          },
        });
      },
      getCategoryById: async (_, { id, opts }) => {
        return getPrismaClient().category.findUnique({
          where: {
            id,
          },
          include: {
            foods: {
              ...opts.foodFilters,
              include: {
                nutrients: true,
                aminoAcids: true,
                category: true,
                fattyAcids: true,
              },
            },
          },
        });
      },
    },
  },
});

// src/modules/fattyAcid/schema.ts
import { createModule as createModule3 } from "graphql-modules";
import * as url3 from "url";

// src/modules/fattyAcid/typeDef.ts
import { gql as gql3 } from "graphql-modules";
var fattyAcidTypeDef = gql3`
  type FattyAcid {
    saturated: Float!
    monounsaturated: Float!
    polyunsaturated: Float!
    twelveZero: Float
    fourteenZero: Float
    fourteenOne: Float
    sixteenZero: Float
    sixteenOne: Float
    eighteenZero: Float
    eighteenOne: Float
    eighteenOneT: Float
    eighteenTwoN6: Float
    eighteenTwoT: Float
    eighteenThreeN3: Float
    twentyZero: Float
    twentyOne: Float
    twentyFour: Float
    twentyFive: Float
    twentyTwoZero: Float
    twentyTwoFive: Float
    twentyTwoSix: Float
    twentyFourZero: Float
  }
`;
var typeDefs3 = [fattyAcidTypeDef];

// src/modules/fattyAcid/schema.ts
var __dirname3 = url3.fileURLToPath(new URL(".", import.meta.url));
var fattyAcidModule = createModule3({
  id: "fatty-acid-module",
  dirname: __dirname3,
  typeDefs: typeDefs3,
});

// src/modules/food/schema.ts
import { createModule as createModule4 } from "graphql-modules";
import * as url4 from "url";

// src/modules/food/typeDef.ts
import { gql as gql4 } from "graphql-modules";
var foodTypeDef = gql4`
  type Food {
    id: Int!
    name: String!
    category: Category!

    aminoAcids: AminoAcid
    fattyAcids: FattyAcid
    nutrients: Nutrient
  }
`;
var queryTypeDef2 = gql4`
  extend type Query {
    getAllFood(opts: PrismaQueryOptions): [Food]!
    getFoodById(id: Int!): Food
    getFoodByName(name: String!): [Food]!
  }
`;
var typeDefs4 = [queryTypeDef2, foodTypeDef];

// src/modules/food/schema.ts
var __dirname4 = url4.fileURLToPath(new URL(".", import.meta.url));
var foodModule = createModule4({
  id: "food-module",
  dirname: __dirname4,
  typeDefs: typeDefs4,
  resolvers: {
    Query: {
      getAllFood: async (_, { opts }) => {
        return getPrismaClient().food.findMany({
          ...opts,
          include: {
            category: true,
            nutrients: true,
            aminoAcids: true,
            fattyAcids: true,
          },
        });
      },
      getFoodById: async (_, { id }) => {
        return getPrismaClient().food.findUnique({
          where: {
            id,
          },
          include: {
            category: true,
            nutrients: true,
            aminoAcids: true,
            fattyAcids: true,
          },
        });
      },
      getFoodByName: async (_, { name }) => {
        return getPrismaClient().food.findMany({
          where: {
            name: {
              contains: name,
            },
          },
          include: {
            category: true,
            nutrients: true,
            aminoAcids: true,
            fattyAcids: true,
          },
        });
      },
    },
  },
});

// src/modules/main/schema.ts
import { createModule as createModule5, gql as gql5 } from "graphql-modules";
import * as url5 from "url";
var __dirname5 = url5.fileURLToPath(new URL(".", import.meta.url));
var mainModule = createModule5({
  id: "main-module",
  dirname: __dirname5,
  typeDefs: [
    gql5`
      input PrismaQueryOptions {
        skip: Int
        take: Int
      }

      type Query
    `,
  ],
  resolvers: {
    Query: {},
  },
});

// src/modules/nutrient/schema.ts
import { createModule as createModule6 } from "graphql-modules";
import * as url6 from "url";

// src/modules/nutrient/typeDef.ts
import { gql as gql6 } from "graphql-modules";
var nutrientTypeDef = gql6`
  type Nutrient {
    moisture: Float
    kcal: Float
    kJ: Float
    protein: Float
    lipids: Float
    cholesterol: Float
    carbohydrates: Float
    dietaryFiber: Float
    ash: Float
    calcium: Float
    magnesium: Float
    manganese: Float
    phosphorus: Float
    iron: Float
    sodium: Float
    potassium: Float
    copper: Float
    zinc: Float
    retinol: Float
    re: Float
    rae: Float
    thiamin: Float
    riboflavin: Float
    pyridoxine: Float
    niacin: Float
    vitaminC: Float
  }
`;
var typeDefs5 = [nutrientTypeDef];

// src/modules/nutrient/schema.ts
var __dirname6 = url6.fileURLToPath(new URL(".", import.meta.url));
var nutrientModule = createModule6({
  id: "nutrient-module",
  dirname: __dirname6,
  typeDefs: typeDefs5,
});

// src/modules/unit/schema.ts
import { createModule as createModule7 } from "graphql-modules";
import * as url7 from "url";

// src/modules/unit/typeDefs.ts
import { gql as gql7 } from "graphql-modules";
var unitTypeDef = gql7`
  type Unit {
    id: Int!
    fieldName: String!
    unit: String!
    labelPt: String!
    infoodsTagname: String
    systematicName: String
    commonName: String
  }
`;
var queryTypeDef3 = gql7`
  extend type Query {
    getUnits: [Unit]!
    getUnitByFieldName(fieldName: String!): Unit
  }
`;
var typeDefs6 = [queryTypeDef3, unitTypeDef];

// src/modules/unit/schema.ts
var __dirname7 = url7.fileURLToPath(new URL(".", import.meta.url));
var unitModule = createModule7({
  id: "unit-module",
  dirname: __dirname7,
  typeDefs: typeDefs6,
  resolvers: {
    Query: {
      getUnits: async () => {
        return await getPrismaClient().unit.findMany();
      },
      getUnitByFieldName: async (_, { fieldName }) => {
        return await getPrismaClient().unit.findFirst({
          where: {
            fieldName,
          },
        });
      },
    },
  },
});

// src/app.ts
dotenv.config();
var app = express();
var api = createApplication({
  modules: [
    mainModule,
    unitModule,
    foodModule,
    categoryModule,
    aminoAcidModules,
    fattyAcidModule,
    nutrientModule,
  ],
});
app.use(cors());
app.use(
  "/graphql",
  createHandler({
    schema: api.schema,
    execute: api.createExecution(),
  })
);
app.listen(env.PORT, () =>
  console.log(`Example app listening on port ${env.PORT}!`)
);
var app_default = app;
export { app_default as default };
