<template>
    <div :class="{'loader-content': true, 'fixed': isFixed}" style="z-index:9999" v-if="value">
        <i class="fa fa-spin fa-spinner"></i>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    export default Vue.extend({
        data() {
            return {
                isFixed: false
            };
        },
        props: ["value", "fixed"],
        mounted() {
            this.setPosition();
            this.isFixed = this.fixed != undefined;
        },
        watch: {
            value() {
                this.setPosition();
            }
        },
        methods: {
            setPosition() {
                let parent = this.$el.parentElement;
                if (parent) {
                    parent.style.position = this.value ? "relative" : "";
                    parent.style.minHeight = this.value ? "100px" : "";
                }
            }
        }
    })
</script>

<style scoped lang="scss">
.loader-content {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(244,244,244,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    i.fa-spin {
        font-size: 32px;
    }

    &.fixed {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
    }
}
</style>
