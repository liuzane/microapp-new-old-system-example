import { federation, createModuleFederationConfig } from '@module-federation/vite';

export default (env: Record<string, string>) => federation(createModuleFederationConfig({
  name: 'new',
  remotes: {
    mockDB: {
      type: 'module',
      name: 'mockDB',
      entry: `${env.VITE_MOCKDB_URL}/remoteEntry.js`,
      entryGlobalName: 'mockDB',
      shareScope: 'default',
    },
  },
  exposes: {},
  shared: {},
}));
