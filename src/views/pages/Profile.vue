<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid v-if="!isEdit">
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <h1 class="text-center">Profile Info</h1>
              <b-card>
                <div class="bg-info text-light p-3">
                  <div class="mb-3"><b>User name:</b> admin</div>
                  <div><b>Email:</b> nguyenthanhdiep21051995@gmail.com</div>
                </div>
              </b-card>
              <div class="d-flex justify-content-center">
                <b-button variant="outline-primary" class="mr-3" @click="back"
                  >Back</b-button
                >
                <b-button variant="outline-info" @click="onEditProfile"
                  >Edit profile</b-button
                >
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
    <CContainer fluid v-else>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1 class="text-center">Edit Profile Info</h1>
                <!-- <p class="text-muted">Create your account</p> -->
                <CInput
                  placeholder="Username"
                  autocomplete="username"
                  v-model="userName"
                >
                  <template #prepend-content
                    ><CIcon name="cil-user"
                  /></template>
                </CInput>
                <CInput
                  placeholder="Email"
                  autocomplete="email"
                  prepend="@"
                  v-model="email"
                />
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="new-password"
                  v-model="password"
                >
                  <template #prepend-content
                    ><CIcon name="cil-lock-locked"
                  /></template>
                </CInput>
                <CInput
                  placeholder="Repeat password"
                  type="password"
                  autocomplete="new-password"
                  class="mb-4"
                  v-model="rePassword"
                >
                  <template #prepend-content
                    ><CIcon name="cil-lock-locked"
                  /></template>
                </CInput>
                <CRow class="d-flex justify-content-center">
                  <CButton color="secondary" class="mr-3" @click="onCancelEdit"
                    >Cancel</CButton
                  >
                  <CButton color="primary">Save</CButton>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      isEdit: false,
      id: 0,
      userName: "",
      password: "",
      rePassword: "",
      email: "",
    };
  },
  methods: {
    onEditProfile() {
      this.isEdit = true;
    },
    onCancelEdit() {
      this.isEdit = false;
    },
    back() {},
  },
};
</script>
