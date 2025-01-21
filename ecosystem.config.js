module.exports = {
  apps: [
    {
      name: 'task-management',
      script: 'index.js',
      instances: '1',
      exec_mode: 'cluster',
      ignore_watch: ["node_modules", "logs", "storage"],
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    }
  ],
};