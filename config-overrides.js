const path = require('path')

module.exports = {
  // webpack: function (config, env) {
  //   console.log(JSON.stringify(config), null, 2)
  //   // your webpack configs
  //   return config;
  // },
  // the paths config used when your React app is builded
  paths: function (paths, env) {
    // paths.appPath = path.join(__dirname)
    paths.appSrc = path.join(__dirname, 'client')
    paths.appIndexJs = path.join(__dirname, 'client', 'index.tsx')
    paths.appTsConfig = path.join(__dirname, 'client', 'tsconfig.json')
    paths.appTypeDeclarations = path.join(__dirname, 'client', 'react-app-env.d.ts')
    paths.appPublic = path.join(__dirname, 'client', 'public')
    paths.appHtml = path.join(__dirname, 'client', 'public', 'index.html')
    paths.appBuild = path.join(__dirname, 'dist', 'static')
    // paths.dotenv = path.join(__dirname, 'client', '.env')
    // console.log(JSON.stringify(paths, null, 2))

    return paths;
  }
}
