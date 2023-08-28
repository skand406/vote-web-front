import axios from "axios";
import router from '@/router'

// url 호출 시 기본 값 셋팅
const api = axios.create({
  baseURL: "", // vue.config.js 프록시 설정 사용
  headers: {
    "Content-type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    console.log("!!!!!!!!!token", token);

    //요청시 AccessToken 계속 보내주기
    if (!token) {
      config.headers.accessToken = null;
      config.headers.refreshToken = null;
      return config;
    }

    if (config.headers && token) {
      console.log("여기냐?");
      const { accesstoken, refreshtoken } = JSON.parse(token);
      console.log("accesstoken", accesstoken);
      config.headers.authorization = `Bearer ${accesstoken}`;
      config.headers.refreshToken = `Bearer ${refreshtoken}`;
      return config;
    }
    // Do something before request is sent
    console.log("request start", config);
  },
  function (error) {
    // Do something with request error
    console.log("request error", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    // 2xx 범위의 상태 코드에 대한 응답 처리
    // response 데이터와 작업을 수행합니다.
    console.log("get response", response);
    return response;
  },
  async (error) => {
    console.log("error", error);
    if (error.response) {
      const {
        config,
        response: { status },
      } = error;

      console.log("status", status);
      // 401 Unauthorized 상태 코드에 대한 처리
      if (status === 401) {
        console.log("111111111");
        console.log("expired");
        const originalRequest = config;
        const token = await localStorage.getItem("token");
        const refreshToken = await localStorage.getItem("refresh_token");
        console.log('token', token);
        console.log('refreshToken', refreshToken);

        // Access Token 갱신을 위한 요청
        const { data } = await axios.post(
          `auths/refresh`, // 토큰 갱신 API의 URL
          { token },
          { headers: { authorization: `Bearer ${refreshToken}` } }
        );

        // 새로운 Access Token과 Refresh Token 저장 (예: 로컬 스토리지)
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          data;
        await localStorage.multiSet([
          ["token", newAccessToken],
          ["refresh_token", newRefreshToken],
        ]);

        // 요청 헤더에 새로운 Access Token 설정
        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;

        // 401로 실패한 요청을 새로운 Access Token으로 재시도
        return axios(originalRequest);

        // if (error.response.data.message === "expired") {

        // }
      }

      if (status === 403) {
        console.log("403에러임");
        // access, refresh token 둘다 만료, 재로그인 요청 필요
        // 로그인으로 이동
        await router.push({ path: "/login" });

        return;
      }
      // await router.push({ path: "/login" });
    }

    // 2xx 범위 밖의 상태 코드에 대한 에러 처리
    console.log("response error", error);
    return Promise.reject(error);
  }
);

export default api;
