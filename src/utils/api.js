import axios from "axios";
import router from "@/router";

// url 호출 시 기본 값 셋팅
const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");

    if (config.authRequired !== false) {
      //요청시 AccessToken 계속 보내주기
      if (!token) {
        config.headers.accessToken = null;
        config.headers.refreshToken = null;
        return config;
      }

      if (config.headers && token) {
        config.headers.authorization = `Bearer ${token}`;
        return config;
      }
    } else {
      return config;
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    // 2xx 범위의 상태 코드에 대한 응답 처리
    return response;
  },
  async (error) => {
    if (error.response) {
      const {
        config,
        response: { status },
      } = error;

      const refreshToken = await localStorage.getItem("refreshToken");

      // 401 Unauthorized 상태 코드에 대한 처리
      if (status === 401) {
        const originalRequest = config;

        // Access Token 갱신을 위한 요청
        const { data } = await axios.post(
          "/auths/refresh", // 토큰 갱신 API의 URL
          { refreshToken: refreshToken },
          { headers: { authorization: null } }
        );

        // 새로운 access token 저장
        const tokenString = JSON.stringify(data);
        const { accessToken } = JSON.parse(tokenString);
        await localStorage.setItem("accessToken", accessToken);

        // 요청 헤더에 새로운 Access Token 설정
        originalRequest.headers.authorization = `Bearer ${accessToken}`;

        // 401로 실패한 요청을 새로운 Access Token으로 재시도
        return axios(originalRequest);
      }

      // access, refresh token 둘다 만료, 재로그인 요청 필요
      if (status === 403) {
        await router.push({ path: "/login" });

        return;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
