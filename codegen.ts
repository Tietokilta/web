import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: `https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql?digitransit-subscription-key=16598fce6e4d41109bbc19ea955244b9`,
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ['./apps/web/src/**/**/*.{ts,tsx}'],
  generates: {
    './apps/web/src/assets/api_types/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;