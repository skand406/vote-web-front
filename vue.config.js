const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/auths': { // 로그인 관련
        // '/경로' 로 들어오면 포트 8888(스프링 서버)로 보낸다
        target: 'http://localhost:8888',
        changeOrigin: true // cross origin 허용
      },
      '/users': {
        // '/경로' 로 들어오면 포트 8888(스프링 서버)로 보낸다
        target: 'http://localhost:8888',
        changeOrigin: true // cross origin 허용
      },
      '/members': {
        // '/경로' 로 들어오면 포트 8888(스프링 서버)로 보낸다
        target: 'http://localhost:8888',
        changeOrigin: true // cross origin 허용
      },
      '/public': {
        // '/경로' 로 들어오면 포트 8888(스프링 서버)로 보낸다
        target: 'http://localhost:8888',
        changeOrigin: true // cross origin 허용
      },
      '/test': {
        // '/경로' 로 들어오면 포트 8888(스프링 서버)로 보낸다
        target: 'http://localhost:8888',
        changeOrigin: true // cross origin 허용
      },
    },
    client: {
      overlay: true,
      // 웹소켓 설정
      webSocketURL: { hostname: undefined, pathname: undefined, port: '0' },
    },
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
