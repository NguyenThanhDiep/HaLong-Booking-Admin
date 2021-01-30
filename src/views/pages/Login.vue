<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput placeholder="Username" v-model="userName">
                    <template #prepend-content
                      ><CIcon name="cil-user"
                    /></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    v-model="password"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-lock-locked"
                    /></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" @click="onLogin"
                        >Login</CButton
                      >
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0"
                        >Forgot password?</CButton
                      >
                      <CButton color="link" class="d-lg-none"
                        >Register now!</CButton
                      >
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard
              color="primary"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <h2>Welcome to</h2>
                <h2>Ha Long Booking Admin Page</h2>
                <!-- <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <CButton
                  color="light"
                  variant="outline"
                  size="lg"
                >
                  Register Now!
                </CButton> -->
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import AdminService from "../../services/adminService";
import Popup from "../../services/popup";

export default {
  name: "Login",
  data() {
    return {
      adminService: new AdminService(),
      userName: null,
      password: null,
    };
  },
  methods: {
    async onLogin() {
      if (!this.userName || !this.password) {
        await Popup.msgBoxOk("Please enter username and password");
        return false;
      } else {
        const adminInfoArr = await this.adminService.login(
          this.userName,
          this.password
        );
        if (Array.isArray(adminInfoArr) && adminInfoArr.length > 0) {
          this.$store.commit("set", ["isLogin", true]);
          this.$store.commit("set", ["userName", adminInfoArr[0].userName]);
          this.$store.commit("set", ["adminId", adminInfoArr[0].id]);
          this.$router.push({ name: 'Hotels' });
          return true;
        }
      }
    },
  },
};
</script>
