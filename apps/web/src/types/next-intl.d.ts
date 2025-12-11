import type fi from '../locales/fi';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof fi;
  }
}
