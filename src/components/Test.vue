<template>
  <div class="hello">
    Test page
    <router-link to="/info">인포닷</router-link>

    <h1>Validation 테스트</h1>
    <v-form ref="refForm" lazy-validation>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="user_id"
            label="아이디*"
            :rules="user_id_rule"
            :disabled="state == 'ins' ? false : true"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user_nm"
            label="이름*"
            :rules="user_nm_rule"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user_pw"
            label="비밀번호*"
            type="password"
            :rules="user_pw_rule"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user_pw_chk"
            label="비밀번호 확인*"
            type="password"
            :rules="user_pw_rule2"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="user_auth"
            label="권한*"
            :items="authList"
            item-text="name"
            item-value="value"
            return-object
            :rules="user_auth_rule"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="user_desc"
            label="설명"
            :rules="user_desc_rule"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn @click="save()">제출</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "TestVue",
  props: {},
  data() {
    return {
      dialog: false,
      state: "ins",
      authList: [
        { name: "관리자", value: "A" },
        { name: "일반 사용자", value: "M" },
      ],
      user_id: "",
      user_id_rule: [
        (v) => !!v || "아이디는 필수 입력사항입니다.",
        (v) =>
          /^[a-zA-Z0-9]*$/.test(v) || "아이디는 영문+숫자만 입력 가능합니다.",
        (v) =>
          !(v && v.length >= 15) || "아이디는 15자 이상 입력할 수 없습니다.",
      ],
      user_nm: "",
      user_nm_rule: [
        (v) => !!v || "이름은 필수 입력사항입니다.",
        (v) => !(v && v.length >= 30) || "이름은 30자 이상 입력할 수 없습니다.",
        (v) =>
          !/[~!@#$%^&*()_+|<>?:{}]/.test(v) ||
          "이름에는 특수문자를 사용할 수 없습니다.",
      ],
      user_pw: "",
      user_pw_chk: "",
      user_pw_rule: [
        (v) =>
          this.state === "ins"
            ? !!v || "패스워드는 필수 입력사항입니다."
            : true,
        (v) =>
          !(v && v.length >= 30) || "패스워드는 30자 이상 입력할 수 없습니다.",
      ],
      user_pw_rule2: [
        (v) =>
          this.state === "ins"
            ? !!v || "패스워드는 필수 입력사항입니다."
            : true,
        (v) =>
          !(v && v.length >= 30) || "패스워드는 30자 이상 입력할 수 없습니다.",
        (v) => v === this.user_pw || "패스워드가 일치하지 않습니다.",
      ],
      user_auth: "",
      user_auth_rule: [(v) => !!v || "권한은 필수 선택 사항입니다."],
      user_desc: "",
      user_desc_rule: [
        (v) =>
          !(v && v.length >= 100) || "설명은 100자 이상 입력할 수 업습니다.",
      ],
    };
  },
  mounted() {
    // this.getApi()
  },
  methods: {
    async getApi() {
      console.log("get Api");
      const response = await this.axios({
        url: "/auth/hello",
        method: "GET",
      });

      console.log("res", response);
    },
    async save() {
      const validate = await this.$refs.refForm.validate();
      console.log("validate", validate);
      if (!validate) {
        console.log("거짓");
      } else {
        console.log("참");
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
