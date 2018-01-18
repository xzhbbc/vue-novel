module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  apps : [
      // First application
      {
          name      : "novel",
          script    : "./server/app.js",
          env: {
              COMMON_VARIABLE: "true"
          },
          env_production : {
              NODE_ENV: "production"
          }
      }
  ],
  deploy : {
    production : {
      user : 'xzh',
      host : '120.77.209.3',
      port: "22",
      ref  : 'origin/master',
      repo : 'git@github.com:xzhbbc/vue-novel.git',
      ssh_options: 'StrictHostKeyChecking=no',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      env  : {
          NODE_ENV: 'production'
      }
    }
  }
};
