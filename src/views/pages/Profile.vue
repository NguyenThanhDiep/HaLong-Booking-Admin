<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid v-if="!isEdit">
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <h1 class="text-center">Profile Info</h1>
              <b-card>
                <div class="bg-success text-light p-3">
                  <div class="mb-3"><b>User name:</b> {{ userName }}</div>
                  <div><b>Email:</b> {{ email }}</div>
                </div>
              </b-card>
              <div class="row">
                <button class="col-6 btn btn-secondary" @click="back">
                  Back
                </button>
                <button class="col-6 btn btn-primary" @click="onEditProfile">
                  Edit profile and change password
                </button>
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
                  placeholder="New password"
                  type="password"
                  v-model="password"
                >
                  <template #prepend-content
                    ><CIcon name="cil-lock-locked"
                  /></template>
                </CInput>
                <CInput
                  placeholder="Repeat password"
                  type="password"
                  class="mb-4"
                  v-model="rePassword"
                >
                  <template #prepend-content
                    ><CIcon name="cil-lock-locked"
                  /></template>
                </CInput>
                <div class="row">
                  <button class="col-6 btn btn-secondary" @click="onCancelEdit">
                    Cancel
                  </button>
                  <button
                    class="col-6 btn btn-primary"
                    @click="onSave"
                    :disabled="isDisabledSave"
                  >
                    Save
                  </button>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import AdminService from "../../services/adminService";
import Popup from "../../services/popup";

export default {
  name: "Profile",
  data() {
    return {
      adminService: new AdminService(),
      isEdit: false,
      id: 0,
      userName: "",
      password: "",
      rePassword: "",
      email: "",
    };
  },
  async mounted() {
    this.$root["loading"] = true;
    const adminData = await this.adminService.getAdminById(1);
    if (adminData) {
      this.id = adminData.id;
      this.userName = adminData.userName;
      this.email = adminData.email;
      this.password = this.rePassword = adminData.password;
    }
    this.$root["loading"] = false;
  },
  methods: {
    onEditProfile() {
      this.isEdit = true;
    },
    onCancelEdit() {
      this.isEdit = false;
    },
    buildModelForAPI() {
      return {
        id: this.id,
        userName: this.userName,
        password: this.password,
        email: this.email,
      };
    },
    async onSave() {
      if (this.rePassword !== this.password) {
        await Popup.msgBoxOk("Two passwords have to be the same");
        return false;
      }
      this.$root["loading"] = true;
      const adminModel = this.buildModelForAPI();
      const rs = await this.adminService.updateAdmin(adminModel);
      if (rs) {
        this.$bvToast.toast("Update admin successfully!", {
          title: "Success",
          variant: "success",
          solid: true,
        });
      } else {
        this.$bvToast.toast("An error occurs when updating admin!", {
          title: "Error",
          variant: "danger",
          solid: true,
        });
      }
      this.isEdit = false;
      this.$root["loading"] = false;
    },
    back() {
      this.$router.push({ name: 'Bookings' });
    },
  },
  computed: {
    isDisabledSave() {
      return (
        !this.userName || !this.email || !this.password || !this.rePassword
      );
    },
  },
};
</script>
