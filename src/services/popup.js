import Vue from 'vue';

export default class Popup {
    static async confirmYesNo(message, vueComponent = new Vue(), options = null){
        const msgBox = {
            title: options?.title,
            headerClass: "" + options?.headerClass,
            centered: options?.centered || true,
            size: options ? options.size : "sm",
            bodyClass: "justify-content-center text-center",
            okTitle: options ? options.okTitle : 'Yes',
            okVariant: options ? options.okVariant :  "btn btn-outline-primary btnOk",
            cancelTitle: options ? options.cancelTitle : 'Cancel',
            cancelVariant: options ? options.cancelVariant :  "btn btn-outline-secondary",
            footerClass:  options?.footerClass || "justify-content-center border-top-0 pt-0",
            hideHeaderClose: options?.hideHeaderClose,
            noCloseOnBackdrop: true
        };

        // delay focus button Ok when popup confirm open
        const interval = setInterval(() => {
            const ele = document.getElementsByClassName('btnOk')[0];
            if (ele && ele instanceof HTMLElement) {
                clearInterval(interval);
                ele.focus();
            }
        }, 800)
        return new Promise((r) => {
            vueComponent.$bvModal.msgBoxConfirm(message, msgBox).then(res => {
                r(res)
            });
        })
    }
}